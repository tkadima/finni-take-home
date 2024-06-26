# Documentation

## Step 1 - Gathering requirements:

After reviewing the prompt for the take-home project, I asked several questions to clarify the project requirements. I was informed that seeding the database is acceptable and that the data should be clearly presented for clinical use, with no specific design guidelines. There are no particular format requirements for data storage, and patients can have at least one address and phone number, with a maximum of two phone numbers but no limit on addresses. For searches and filters, a full equality match and single-option filters are the minimum requirements, though more advanced features are welcome. Configurable forms have no limits on the types or number of custom fields. The application should be designed for desktop use only.

With these clarifications, I began building a web-based application using Next JS, ensuring it meets the outlined requirements while balancing functionality, code quality, robustness, feature completeness, and design.

## Step 2 - Initial set up

I started by initializing a new Next.js project with TypeScript support using `create-next-app`. Next, I installed the necessary dependencies for SQLite, MUI, SWR, and Prettier. I chose SQLite because it is practical for a small take-home project due to its serverless, self-contained nature and lack of configuration requirements. This simplicity allows it to be easily configured and run locally, enabling me to focus on the breadth of the project. I set up SQLite by creating the database and migration files, ensuring the correct paths were specified.

I used MUI as my UI kit because I was familiar with it and knew I would want to use the MUI data grid for its configurable form capabilities. I customized `_app.tsx` to include MUI's theme provider. Then, I created a custom hook for data fetching using SWR to keep the code cleaner and more maintainable. I used Prettier for linting to ensure my code was clear and readable. Prettier was configured with a `.prettierrc` file and a script in `package.json` to format the code.

Given my limited time, I wanted to make sure my setup worked before delving further into data formatting and seeding. I added a single line of sample data to verify that data could be successfully retrieved from the database to the client. Throughout the process, I ensured proper paths and configurations, and after troubleshooting and adjustments, I successfully ran the development server to verify the setup. This was a good stopping point for the day and I planned to continue on with the data model and seeding the database.

## Step 3 - Patient table migration and seeding

I added a migration to create a `patients` table in the database and a seed script to populate it with sample data. I chose to store the `addresses` and `additional_fields` as JSON to avoid creating additional tables and unnecessary joins.

## Step 4 - Display patient data in data table

I displayed the data using a MUI DataGrid. The columns are populated based on the specified fields. The first, middle, and last names are aggregated into one column, and additional fields are grouped into a separate column. Then, I customized the theme of the grid using the logo, fonts, and colors from FiniHealth.com.
![DataGrid](public/datagrid-plain.png)
![DataGrid](public/datagrid-customized.png)

## Step 5 - Allow CRUD Operations on Patient Data

The next step was to enable providers to manage patients on the grid. I interpreted "manage" to include creating, updating, and deleting patient records. While MUI typically allows updates directly within the grid, the large amount of data involved made it impractical to create an "edit" view that would remain readable. Therefore, I opted to use a modal instead. Given the extensive data to manage for a single patient, I divided the modal into tabs: one for basic patient data (first name, last name, middle name, date of birth, status), another for addresses, and a final tab for configurable data.

The same modal is used for both creating and editing patients; the only difference is that the form is pre-filled with the patient's current information when in "edit" mode. For deletions, I added a confirmation dialog to ensure users have a chance to confirm their intent to delete a particular patient.

I enhanced my useFetch hook to support additional operations. The mutate function within the hook triggers SWR to re-fetch data after a mutation, ensuring that changes are immediately reflected in the UI.

Additional Details:
PatientModal.tsx: This file contains the implementation of the modal used for both creating and editing patient records. The modal is divided into tabs to handle different sections of patient data efficiently.

DeleteWarningDialog.tsx: This file includes the implementation of the confirmation dialog that appears when a user attempts to delete a patient record. It provides an extra layer of user confirmation to prevent accidental deletions.

useFetch.ts: This custom hook has been extended to handle CRUD operations. It ensures that data mutations trigger a re-fetch, keeping the grid data up-to-date.

index.tsx: The main file where the patient management functionality is integrated, including the grid and modal invocation logic.

These design choices aim to provide a clear, user-friendly interface for managing patient data while maintaining data integrity and immediate feedback for any changes made.

## Step 6 - Search and Filter

This is where using MUI comes in handy. MUI data grid makes searching and filtering data trivial with the "GridToolbar." The only change I had to make was to add a "full_name" field to the input data so it would be searchable.

## Step 7 Optimizations

I noticed that the initial page load was slow so I decided to use server-sider rendering to spead it up. I also used Lazy loading for the PatientModal, DeleteWarningDialog and MutationSnackbar
