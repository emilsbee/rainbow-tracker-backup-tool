import {DateTime} from "luxon"
import shell from "shelljs"
import * as path from "path";
require('dotenv').config()

const currentDate: string = DateTime.now().toFormat("dd-MM-yyyy")
const fileName: string = `${currentDate}.sql`

const pgDumpOutput = shell.exec(`pg_dump -U ${process.env.PG_USER} ${process.env.PG_DATABASE} > ${fileName}`)

if (pgDumpOutput.code !== 0) {
    shell.echo("pg_dump command failed. Error: " + " " + pgDumpOutput.stderr + " Output: " + " " + pgDumpOutput.stdout)
    shell.exit(1)
}


const rsyncOutput = shell.exec(`rsync ${path.join(__dirname, fileName)} ${process.env.BACKUP_MACHINE_USER}@${process.env.BACKUP_MACHINE_IP}:${process.env.BACKUP_MACHINE_ABSOLUTE_PATH}`)

if (rsyncOutput.code !== 0) {
    shell.echo("rsync command failed. Error: " + " " + rsyncOutput.stderr + " Output: " + " " + rsyncOutput.stdout)
    shell.exit(1)
}


const moveBackupOutput = shell.exec(`mv ${fileName} ${process.env.LOCAL_BACKUP_RELATIVE_PATH}`)

if (moveBackupOutput.code !== 0) {
    shell.echo("mv backup command failed. Error: " + " " + moveBackupOutput.stderr + " Output: " + " " + moveBackupOutput.stdout)
    shell.exit(1)
}