const pool = require("../database/")

async function createMessageTable() {
  try {
    // Check if table exists
    const checkTable = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'message'
      );
    `)
    
    if (!checkTable.rows[0].exists) {
      console.log("Creating message table...")
      
      // Create the message table
      await pool.query(`
        CREATE TABLE public.message (
          message_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
          message_subject VARCHAR(255) NOT NULL,
          message_body TEXT NOT NULL,
          message_created TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
          message_to INTEGER NOT NULL,
          message_from INTEGER NOT NULL,
          message_read BOOLEAN DEFAULT FALSE NOT NULL,
          message_archived BOOLEAN DEFAULT FALSE NOT NULL,
          FOREIGN KEY (message_to) REFERENCES public.account(account_id) ON DELETE CASCADE,
          FOREIGN KEY (message_from) REFERENCES public.account(account_id) ON DELETE CASCADE
        );
      `)
      
      // Create indexes
      await pool.query(`CREATE INDEX idx_message_to ON public.message(message_to);`)
      await pool.query(`CREATE INDEX idx_message_from ON public.message(message_from);`)
      await pool.query(`CREATE INDEX idx_message_created ON public.message(message_created DESC);`)
      await pool.query(`CREATE INDEX idx_message_read ON public.message(message_read);`)
      await pool.query(`CREATE INDEX idx_message_archived ON public.message(message_archived);`)
      
      console.log("Message table created successfully!")
    } else {
      console.log("Message table already exists.")
    }
    
    process.exit(0)
  } catch (error) {
    console.error("Error creating message table:", error)
    process.exit(1)
  }
}

createMessageTable() 