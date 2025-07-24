const pool = require("../database/")

async function createReviewTable() {
  try {
    // Check if table exists
    const checkTable = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'review'
      );
    `)
    
    if (!checkTable.rows[0].exists) {
      console.log("Creating review table...")
      
      // Create the review table
      await pool.query(`
        CREATE TABLE public.review (
          review_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
          review_text TEXT NOT NULL,
          review_date TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
          inv_id INTEGER NOT NULL,
          account_id INTEGER NOT NULL,
          FOREIGN KEY (inv_id) REFERENCES public.inventory(inv_id) ON DELETE CASCADE,
          FOREIGN KEY (account_id) REFERENCES public.account(account_id) ON DELETE CASCADE
        );
      `)
      
      // Create indexes
      await pool.query(`CREATE INDEX idx_review_inv_id ON public.review(inv_id);`)
      await pool.query(`CREATE INDEX idx_review_account_id ON public.review(account_id);`)
      await pool.query(`CREATE INDEX idx_review_date ON public.review(review_date DESC);`)
      
      console.log("Review table created successfully!")
    } else {
      console.log("Review table already exists.")
    }
    
    process.exit(0)
  } catch (error) {
    console.error("Error creating review table:", error)
    process.exit(1)
  }
}

createReviewTable() 