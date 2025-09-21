const fs = require("fs");
const path = require("path");
const Resume = require("../models/Resume");
const upload = require("../middlewares/uploadMiddleware");

const uploadResumeImages = async (req, res) => {
  try {
    // Match frontend keys exactly
    upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'profileImg', maxCount: 1 }])(req, res, async (err) => { 
      if (err) {
        return res.status(400).json({ message: "File upload failed", error: err.message });
      }

      const resumeId = req.params.id;
      const resume = await Resume.findOne({ _id: resumeId, userId: req.user._id });

      if (!resume) {
        return res.status(404).json({ message: "Resume not found or unauthorized" });
      }

      const uploadsFolder = path.join(__dirname, '..', 'uploads'); 
      const baseUrl = `${req.protocol}://${req.get("host")}`;

      const newThumbnail = req.files.thumbnail?.[0];
      const newProfileImage = req.files.profileImg?.[0]; // <-- matches frontend now

      // Delete old thumbnail if new uploaded
      if (newThumbnail) {
        if (resume.thumbnailLink) {
          const oldThumbnail = path.join(uploadsFolder, path.basename(resume.thumbnailLink));
          if (fs.existsSync(oldThumbnail)) fs.unlinkSync(oldThumbnail);
        }
        resume.thumbnailLink = `${baseUrl}/uploads/${newThumbnail.filename}`;
      }

      // Delete old profile image if new uploaded
      if (newProfileImage) {
        if (resume.profileInfo?.profilePreviewUrl){
          const oldProfile = path.join(uploadsFolder, path.basename(resume.profileInfo.profilePreviewUrl)); 
          if (fs.existsSync(oldProfile)) fs.unlinkSync(oldProfile);
        }
        resume.profileInfo.profilePreviewUrl = `${baseUrl}/uploads/${newProfileImage.filename}`;
      }

      await resume.save();

      res.status(200).json({
        message: "Images uploaded successfully",
        thumbnailLink: resume.thumbnailLink,
        profilePreviewUrl: resume.profileInfo.profilePreviewUrl,
      }); 
    });
  } catch (err) {
    console.error("Error uploading images: ", err);
    res.status(500).json({ message: "Failed to upload images", error: err.message });
  }
};

module.exports = { uploadResumeImages };
