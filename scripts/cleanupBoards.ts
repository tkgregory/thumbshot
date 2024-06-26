import { deleteUserBoards } from '../e2e/utils/user'

console.log("Cleaning up boards for t.k.gregory+automatedtestuser@gmail.com")
await deleteUserBoards('14e8a408-7011-7068-7ea6-025e2a10baf0') // t.k.gregory+automatedtestuser@gmail.com

console.log("Cleaning up boards for t.k.gregory+proautomatedtestuser@gmail.com")
await deleteUserBoards('14e8a408-7011-7068-7ea6-025e2a10baf0') // t.k.gregory+proautomatedtestuser@gmail.com
