/* Insert the following into the account table: 
Tony, Stark, tony@starkent.com, Iam1ronM@n */
INSERT INTO 
public.account(account_firstname, account_lastname, account_email,account_password)
VALUES('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n')

UPDATE public.account
SET account_type = 'Admin'
WHERE account_id = 1

-- Delete the Tony Stark record from the database.
DELETE FROM public.account
WHERE account_id = 1 -- Tony account_id=1

-- change a huge interior to small interiors for the GM hummer record in the inv_description column.
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'a huge interior','small interiors')
WHERE inv_id = 10 ;


/* Use an inner join to select the make and model fields from the inventory table
and the classification name
field from the classification table for inventory items that belong to the "Sport" category */
SELECT inv.inv_make,
	   inv.inv_model
FROM public.inventory AS inv
INNER JOIN public.classification AS clas
ON inv.classification_id = clas.classification_id
WHERE clas.classification_id = 2 -- The 'Sport' category has a classification_id = 2

/* Update all records in the inventory table to add "/vehicles" to the middle of the file path in 
the inv_image and inv_thumbnail columns using a single query */
UPDATE
  public.inventory
SET
  inv_image = REPLACE(inv_image, '/images', '/images/vehicles'),
  inv_thumbnail = REPLACE(inv_thumbnail, '/images', '/images/vehicles');