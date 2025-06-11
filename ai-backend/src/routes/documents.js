const express = require('express');
const supabase = require('../../lib/supabaseClient');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { data: documents, error } = await supabase
      .from('documents')
      .select('*');

    if (error) throw error;

    // Convert file_path to public URL
    const bucketName = 'your-bucket-name'; // Replace with your bucket name
    const docsWithUrls = documents.map(doc => {
      const { data } = supabase
        .storage
        .from(bucketName)
        .getPublicUrl(doc.file_path);

      return {
        ...doc,
        url: data.publicUrl,
      };
    });

    res.json(docsWithUrls);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

module.exports = router;
