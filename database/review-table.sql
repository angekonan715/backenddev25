-- Create the review table
CREATE TABLE IF NOT EXISTS public.review (
    review_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    review_text TEXT NOT NULL,
    review_date TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    inv_id INTEGER NOT NULL,
    account_id INTEGER NOT NULL,
    FOREIGN KEY (inv_id) REFERENCES public.inventory(inv_id) ON DELETE CASCADE,
    FOREIGN KEY (account_id) REFERENCES public.account(account_id) ON DELETE CASCADE
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_review_inv_id ON public.review(inv_id);
CREATE INDEX IF NOT EXISTS idx_review_account_id ON public.review(account_id);
CREATE INDEX IF NOT EXISTS idx_review_date ON public.review(review_date DESC); 