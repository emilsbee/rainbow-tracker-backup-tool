#!/usr/bin/env node
import {DateTime} from "luxon"
import shell from "shelljs"
import * as path from "path";
require('dotenv').config()

const currentDate: string = DateTime.now().toFormat("dd-MM-yyyy")
const fileName: string = `${currentDate}.sql`

/**
 * Generates the backup sql file.
 */
const pgDumpOutput = shell.exec(`pg_dump -U ${process.env.PG_USER} ${process.env.PG_DATABASE} > ${fileName}`)

if (pgDumpOutput.code !== 0) {
    shell.exit(1)
}

/**
 * Syncs the backup to the remote backup host.
 */
const rsyncOutput = shell.exec(`rsync ${path.join(__dirname, fileName)} ${process.env.BACKUP_MACHINE_USER}@${process.env.BACKUP_MACHINE_IP}:${process.env.BACKUP_MACHINE_ABSOLUTE_PATH}`)

if (rsyncOutput.code !== 0) {
    shell.exit(1)
}

/**
 * Moves the local backup out of the project directory into the some backup directory.
 */
const moveBackupOutput = shell.exec(`mv ${fileName} ${process.env.LOCAL_BACKUP_RELATIVE_PATH}`)

if (moveBackupOutput.code !== 0) {
    shell.exit(1)
}