<
## Project Overview

The task involves developing Features such as adding and editing of product,sorting ,filtering and the pagination in the product page.

## Github Repo:

https://github.com/shamonT/MERNstack-MachineTask.git

### Video Explanation

https://www.loom.com/share/e926c9016f404ac19c5e01f02c22da80?sid=9fc3966a-0800-4464-88c3-23132038952e

### Setting Up the Project

To set up the project locally, follow these steps:

1. Clone the repository and navigate to the project folder.
2. Import the product_database.sql file in to your MySQL database (you can use commandprompt).
3. Update the .env file with your own MySQL credentials.
4. Run `npm install --force`.
5. Start the project using `npm run dev`.
6. Access the NextJS website at http://localhost:3000.
7. Setup the database, You would need mysql and workbench for the database. You can get it from here: https://dev.mysql.com/downloads/installer. To Import data in do refer to this document: https://dev.mysql.com/doc/workbench/en/wb-admin-export-import-management.html

### Requirements

#### Project Setup

1. **Project Setup**: Ensure proper project setup as per the provided instructions.

#### Pagination for products

2. **Main Section**: Displayed a paginated list of product in the main section.

#### Product Sorting and Filtering

3. **Product Sorting**: Implemented options for sorting products based on price, creation date (created_at), and rating.
4. **Brand Filter**: Enabled product filtering by the chosen brand and emphasize the selected brands within the respective tab.
5. **Category Filter**: Allowed product filtering by the selected category and highlight the chosen category within its designated tab.
6. **Price Range Filter**: Provided the ability to filter products based on the selected price range and highlight the chosen range within its dedicated tab.
7. **Occasion Filter**: Enabled product filtering based on the selected occasion and highlight the chosen occasion within its specific tab.
8. **Discount Filter**: Implemented product filtering based on the selected discount and highlight the chosen discount within its dedicated tab.
9. **URL Parameters**: Stored all filter and sort options in the URL parameters to replicate the user's browsing state when sharing URLs.

#### Product Operations (Create/Edit/Delete)

10. **Create Product**: Allowed the users to crete product along with the image by using cloudinary.
11. **Edit Product**: Allowed the users to modify specific product details along with the image by using cloudinary.
12. **Delete Product**: Provided the functionality to remove a particular product from the list.



