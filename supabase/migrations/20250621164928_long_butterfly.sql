/*
  # Add RLS policies for flashcards table

  1. Security
    - Add INSERT policy for users to create flashcards for their own documents
    - Add UPDATE policy for users to modify flashcards for their own documents  
    - Add DELETE policy for users to delete flashcards for their own documents
    
  2. Policy Logic
    - Users can only manage flashcards that belong to documents in courses they own
    - Uses JOIN with documents and courses tables to verify ownership
*/

-- Policy to allow users to create flashcards for their own documents
CREATE POLICY "Users can create flashcards for their documents"
  ON flashcards
  FOR INSERT
  TO public
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM documents
      JOIN courses ON documents.course_id = courses.id
      WHERE documents.id = flashcards.document_id 
        AND courses.user_id = auth.uid()
    )
  );

-- Policy to allow users to update flashcards for their own documents
CREATE POLICY "Users can update flashcards for their documents"
  ON flashcards
  FOR UPDATE
  TO public
  USING (
    EXISTS (
      SELECT 1
      FROM documents
      JOIN courses ON documents.course_id = courses.id
      WHERE documents.id = flashcards.document_id 
        AND courses.user_id = auth.uid()
    )
  );

-- Policy to allow users to delete flashcards for their own documents
CREATE POLICY "Users can delete flashcards for their documents"
  ON flashcards
  FOR DELETE
  TO public
  USING (
    EXISTS (
      SELECT 1
      FROM documents
      JOIN courses ON documents.course_id = courses.id
      WHERE documents.id = flashcards.document_id 
        AND courses.user_id = auth.uid()
    )
  );