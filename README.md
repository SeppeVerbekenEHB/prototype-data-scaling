# prototype-data-scaling

A simple web application to view and filter plant data using a MariaDB database. This application allows users to retrieve, display, and filter plant information based on various criteria.

## Features

- Fetch and display plant data from a MariaDB database.
- Filter plants by bloom time, planting time, and search by plant name and discoverer.
- Built with HTML, CSS (Bootstrap), and JavaScript (Axios).
- Caching
- Seeder batching

## Technologies Used

- **Frontend**: HTML, CSS (Bootstrap), JavaScript
- **Backend**: Node.js, Express
- **Database**: MariaDB
- **Seeder**: Faker.js

## Installation

### Prerequisites

1. Ensure you have [Node.js](https://nodejs.org/) installed on your machine.
2. Have [MariaDB](https://mariadb.org/) set up and running with the required database.

### Clone the Repository

```bash
git clone https://github.com/SeppeVerbekenEHB/prototype-data-scaling.git
```
### Install Dependencies

```bash
npm install
```

### Configure Database

Ensure your mariaDB database is set up and accessible. You may need tot create the necessary tables and populate them with data.
When running the project for the first time you should add a database "Flora", it should have a table"plants".
The structure of a plant looks like this:
```sql
CREATE TABLE plants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    bloom_time VARCHAR(20) NOT NULL,
    planting_time VARCHAR(20) NOT NULL,
    discoverer VARCHAR(100),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Start the Server

```bash
node index.js
```
The server will start and listen on **http://localhost:3000**

## Usage

1. Run the database seeder by running this command.
```bash
   npx sequelize-cli db:seed --seed 20241016075140-plantSeeder.js
```   
2. Open your web browser and navigate to **http://localhost:3000**
3. Use the dropdown menus to filter by bloom time and planting time
4. Use teh search fields to filter plants by name or discoverer.

## Example Plant Data

Here's an example of how the plant data might look in the database:
```sql
INSERT INTO plants (name, bloom_time, planting_time, discoverer) VALUES 
('Rose', 'April', 'March', 'Alice'),
('Tulip', 'May', 'April', 'Bob'),
('Daisy', 'June', 'May', 'Charlie');
```

## Caching

To enhance performance, consider configuring query caching in your MariaDB settings.
You can check the cache status with the following SQL command:
```sql
SHOW STATUS LIKE 'Qcache%';
```

have_query_cache should have a value of "YES"
You can enhance the Cache data by running:
```sql
SET GLOBAL query_cache_size = 1000000;
```

## License

This project is licensed under the MIT License.