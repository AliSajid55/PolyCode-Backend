const oopsProgress = require("../services/oopsCppProgressService");

async function getProgress(req, res) {
  try {
    const progress = await oopsProgress.getProgress(req.userId);
    res.json({ progress });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function setLastLesson(req, res) {
  try {
    const { lessonId } = req.body;
    if (!lessonId) return res.status(400).json({ error: "lessonId is required" });

    const progress = await oopsProgress.setLastLesson(req.userId, lessonId);
    res.json({ progress });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function completeLesson(req, res) {
  try {
    const { lesson } = req.body;
    if (!lesson?.id && !lesson?.lessonId) {
      return res.status(400).json({ error: "lesson metadata is required" });
    }
    const normalizedLesson = {
      ...lesson,
      lessonId: lesson.lessonId || lesson.id,
    };
    if (!normalizedLesson.title || !normalizedLesson.chapterId) {
      return res.status(400).json({ error: "lesson metadata is required" });
    }

    const progress = await oopsProgress.completeLesson(
      req.userId,
      normalizedLesson,
    );
    res.json({ progress });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function saveCode(req, res) {
  try {
    const { lessonId, code } = req.body;
    if (!lessonId) return res.status(400).json({ error: "lessonId is required" });

    const progress = await oopsProgress.saveCode(
      req.userId,
      lessonId,
      code || "",
    );
    res.json({ progress });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function saveNote(req, res) {
  try {
    const { lessonId, note } = req.body;
    if (!lessonId) return res.status(400).json({ error: "lessonId is required" });

    const progress = await oopsProgress.saveNote(
      req.userId,
      lessonId,
      note || "",
    );
    res.json({ progress });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function toggleBookmark(req, res) {
  try {
    const { lessonId } = req.body;
    if (!lessonId) return res.status(400).json({ error: "lessonId is required" });

    const progress = await oopsProgress.toggleBookmark(req.userId, lessonId);
    res.json({ progress });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function addTime(req, res) {
  try {
    const { minutes } = req.body;
    const progress = await oopsProgress.addTime(req.userId, minutes);
    res.json({ progress });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  getProgress,
  setLastLesson,
  completeLesson,
  saveCode,
  saveNote,
  toggleBookmark,
  addTime,
};
