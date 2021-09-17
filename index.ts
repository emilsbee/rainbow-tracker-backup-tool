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
 * Checks whether the remote backup host already has the backup that is currently being backed up.
 * This prevents accidentally overriding a legitimate backup.
 */
const checkIfRemoteFileExistsOutput = shell.exec(`ssh ${process.env.BACKUP_MACHINE_USER}@${process.env.BACKUP_MACHINE_IP}  test -f  ${process.env.BACKUP_MACHINE_ABSOLUTE_PATH + "/" +fileName}`)

if (checkIfRemoteFileExistsOutput.code === 0) {
    shell.echo(`file ${fileName} already exists on host ${process.env.BACKUP_MACHINE_IP} user ${process.env.BACKUP_MACHINE_USER}`)
    shell.exit(1)
} else if (checkIfRemoteFileExistsOutput.code > 1) {
    shell.exit(1)
}

/**
 * Syncs the backup to the remote backup host.
 */
const rsyncOutput = shell.exec(`rsync ${path.join(__dirname, fileName)} ${process.env.BACKUP_MACHINE_USER}@${process.env.BACKUP_MACHINE_IP}:${process.env.BACKUP_MACHINE_ABSOLUTE_PATH}`)

if (rsyncOutput.code !== 0) {
    shell.echo("rsync command failed. Error: " + " " + rsyncOutput.stderr + " Output: " + " " + rsyncOutput.stdout)
    shell.exit(1)
}

/**
 * Moves the local backup out of the project directory into the some backup directory.
 */
const moveBackupOutput = shell.exec(`mv ${fileName} ${process.env.LOCAL_BACKUP_RELATIVE_PATH}`)

if (moveBackupOutput.code !== 0) {
    shell.echo("mv backup command failed. Error: " + " " + moveBackupOutput.stderr + " Output: " + " " + moveBackupOutput.stdout)
    shell.exit(1)
}