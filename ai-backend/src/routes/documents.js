const express = require('express');
const supabase = require('../../lib/supabaseClient');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // Fetch all documents from 'documents' table
    const { data: documents, error } = await supabase
      .from('documents')
      .select('*');

    if (error) {
      console.error('Supabase error fetching documents:', error);
      return res.status(500).json({ error: 'Failed to fetch documents from database' });
    }

    const bucketName = 'documents'; // replace with your actual bucket name
    const urlExpirySeconds = 60 * 60; // 1 hour expiration for signed URLs

    // Map documents to include signed URL for each file_path
    const docsWithUrls = await Promise.all(
      documents.map(async (doc) => {
        try {
          const { data, error } = await supabase
            .storage
            .from(bucketName)
            .createSignedUrl(doc.file_path, urlExpirySeconds);

          if (error) {
            console.error(`Failed to create signed URL for file_path ${doc.file_path}:`, error);
            return { ...doc, url: null };
          }

          return {
            ...doc,
            url: data.signedUrl,
          };
        } catch (err) {
          console.error(`Unexpected error creating signed URL for ${doc.file_path}:`, err);
          return { ...doc, url: null };
        }
      })
    );

    res.json(docsWithUrls);
  } catch (err) {
    console.error('Unexpected error in documents route:', err);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

module.exports = router;
