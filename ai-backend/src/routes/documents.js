const express = require('express');
const supabase = require('../../lib/supabaseClient');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // Fetch documents from DB (optionally filter by course_id if you want)
    const { data: documents, error } = await supabase
      .from('documents')
      .select('*');

    if (error) throw error;

    const bucketName = 'your-bucket-name'; // <-- Replace this with your actual bucket name

    // Map over documents and get public URL for each file_path
    const docsWithUrls = documents.map(doc => {
      const { publicUrl, error: urlError } = supabase
        .storage
        .from(bucketName)
        .getPublicUrl(doc.file_path);

      if (urlError) {
        console.error(`Error getting public URL for ${doc.file_path}:`, urlError);
        return {
          ...doc,
          url: null, // or you can skip adding url here
        };
      }

      return {
        ...doc,
        url: publicUrl,
      };
    });

    res.json(docsWithUrls);

  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

module.exports = router;
