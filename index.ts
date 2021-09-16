import {DateTime} from "luxon"
import shell from "shelljs"
import * as process from "process";

let currentDate = DateTime.now().toFormat("dd-MM-yyyy")

shell.exec(`pg_dump -U ${process.env.PG_USER} ${process.env.PG_DATABASE} > ${currentDate}.sql`)