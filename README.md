## Automatic Postgres backup tool

### Setup

1. You must create a `.pgpass` file in the home directory of the user who will be running the cron job.
   In this file, you must add the following line `hostname:port:database:username:password`. This will
   authenticate any Postgres commands done through the shell. After creating the file, you must change the
   file permissions by running `chmod 600 ~/.pgpass`.
2. You must create an `.env` file. See `.env.example` for what to include.