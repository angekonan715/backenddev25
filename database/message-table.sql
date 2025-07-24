-- Create the message table
CREATE TABLE IF NOT EXISTS public.message (
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_message_to ON public.message(message_to);
CREATE INDEX IF NOT EXISTS idx_message_from ON public.message(message_from);
CREATE INDEX IF NOT EXISTS idx_message_created ON public.message(message_created DESC);
CREATE INDEX IF NOT EXISTS idx_message_read ON public.message(message_read);
CREATE INDEX IF NOT EXISTS idx_message_archived ON public.message(message_archived); 