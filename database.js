import mysql from 'mysql2'

import dotenv from 'dotenv'
dotenv.config()

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()


// ----- Users -----

export async function getUsers(){
    const [rows] = await pool.query("SELECT * FROM users")
    return rows
}

export async function getUser(user_id){
    const [rows] = await pool.query(`
        SELECT * 
        FROM users
        WHERE user_id = ?
        `, [user_id])
    return rows[0]
}

//const user = await getUser(100)
//console.log(user)

export async function createUser(email, user_password) {
    const [result] = await pool.query(`
        INSERT INTO users (email, user_password)    
        values (?, ?)
    `, [email, user_password])
    const user_id = result.insertId
    return getUser(user_id)
}

//const result = await createUser('ab@gmail.com', 'abc')
//console.log(result)

export async function deleteUser(user_id){
    const [rows] = await pool.query(`
        DELETE 
        FROM users
        WHERE user_id = ?
        `, [user_id])
    return rows
}

//const result = await deleteUser(6)
//console.log(result)


export async function changePassword(user_id, user_password) {
    const [rows] = await pool.query(`
        UPDATE users
        SET user_password = ?
        WHERE user_id = ?
        `, [user_password, user_id])
    return rows
}

/*
export async function changePassword(user_id, user_password) {
    const [rows] = await pool.query(`
        UPDATE users
        SET user_password = "123"
        WHERE user_id = ?
        `, [user_id])
    return rows
}
*/
// ----- Folders -----

export async function getFolders(){
    const [rows] = await pool.query("SELECT * FROM folders")
    return rows
}

export async function getFolder(folder_id){
    const [rows] = await pool.query(`
        SELECT * 
        FROM folders
        WHERE folder_id = ?
        `, [folder_id])
    return rows[0]
}

//const user = await getUser(100)
//console.log(user)

export async function createFolder(creator_id, name, visibility, member_privileges) {
    const [result] = await pool.query(`
        INSERT INTO folders (creator_id, name, visibility, member_privileges)    
        values (?, ?, ?, ?)
    `, [creator_id, name, visibility, member_privileges])
    const folder_id = result.insertId
    return getFolder(folder_id)
}

//const result = await createFolder(1, 'Nowy Folder', 0, 0)
//console.log(result)

export async function deleteFolder(folder_id){
    const [rows] = await pool.query(`
        DELETE 
        FROM folders
        WHERE folder_id = ?
        `, [folder_id])
    return rows
}

export async function updateFolder(folder_id, name, visibility, member_privileges) {
    const [rows] = await pool.query(`
        UPDATE folders
        SET name = ?,
        visibility = ?,
        member_privileges = ?
        WHERE folder_id = ?
        `, [name, visibility, member_privileges, folder_id])
    return rows[0]
}


// ----- Bookmarks -----

export async function getBookmarks(){
    const [rows] = await pool.query("SELECT * FROM bookmarks")
    return rows
}

export async function getBookmark(bookmark_id){
    const [rows] = await pool.query(`
        SELECT * 
        FROM bookmarks
        WHERE bookmark_id = ?
        `, [bookmark_id])
    return rows[0]
}

//const bookmark = await getBookmark(100)
//console.log(bookmark)

export async function createBookmark(folder_id, link) {
    const [result] = await pool.query(`
        INSERT INTO bookmarks (folder_id, link)    
        values (?, ?)
    `, [folder_id, link])
    const bookmark_id = result.insertId
    return getBookmark(bookmark_id)
}

//const result = await createBookmark(1, 'https://www.youtube.com/watch?v=dQw4w9WgXcQ')
//console.log(result)

export async function deleteBookmark(bookmark_id){
    const [rows] = await pool.query(`
        DELETE 
        FROM bookmarks
        WHERE bookmark_id = ?
        `, [bookmark_id])
    return rows
}

export async function updateBookmark(bookmark_id, scheduler, change_date, page_status) {
    const [rows] = await pool.query(`
        UPDATE bookmarks
        SET scheduler = ?, change_date = ?, page_status = ?
        WHERE bookmark_id = ?
        `, [scheduler, change_date, page_status, bookmark_id])
    return rows[0]
}


// ----- Members -----

export async function getMembers(){
    const [rows] = await pool.query("SELECT * FROM members")
    return rows
}

export async function getMember(member_id){
    const [rows] = await pool.query(`
        SELECT * 
        FROM members
        WHERE member_id = ?
        `, [member_id])
    return rows[0]
}

export async function createMember(folder_id, user_id) {
    const [result] = await pool.query(`
        INSERT INTO members (folder_id, user_id)    
        values (?, ?)
    `, [folder_id, user_id])
    const member_id = result.insertId
    return getMember(member_id)
}

export async function deleteMember(member_id){
    const [rows] = await pool.query(`
        DELETE 
        FROM members
        WHERE member_id = ?
        `, [member_id])
    return rows
}

export async function updateMember(member_id, role, filter_type) {
    const [rows] = await pool.query(`
        UPDATE members
        SET role = ?, filter_type = ?
        WHERE member_id = ?
        `, [role, filter_type, member_id])
    return rows[0]
}

// ----- Domains -----

export async function getDomains(){
    const [rows] = await pool.query("SELECT * FROM domains")
    return rows
}

export async function getDomain(domain_id){
    const [rows] = await pool.query(`
        SELECT * 
        FROM domains
        WHERE domain_id = ?
        `, [domain_id])
    return rows[0]
}

export async function createDomain(folder_id, domain) {
    const [result] = await pool.query(`
        INSERT INTO domains (folder_id, domain)    
        values (?, ?)
    `, [folder_id, domain])
    const domain_id = result.insertId
    return getDomain(domain_id)
}

export async function deleteDomain(domain_id){
    const [rows] = await pool.query(`
        DELETE 
        FROM domains
        WHERE domain_id = ?
        `, [domain_id])
    return rows
}


// ----- Filters -----

export async function getFilters(){
    const [rows] = await pool.query("SELECT * FROM filters")
    return rows
}

export async function getFilter(filter_id){
    const [rows] = await pool.query(`
        SELECT * 
        FROM filters
        WHERE filter_id = ?
        `, [filter_id])
    return rows[0]
}

export async function createFilter(folder_id, filtered_phrase) {
    const [result] = await pool.query(`
        INSERT INTO filters (folder_id, filtered_phrase)    
        values (?, ?)
    `, [folder_id, filtered_phrase])
    const filter_id = result.insertId
    return getFilter(filter_id)
}

export async function deleteFilter(filter_id){
    const [rows] = await pool.query(`
        DELETE 
        FROM filters
        WHERE filter_id = ?
        `, [filter_id])
    return rows
}


// ----- Click Numbers -----

export async function getClickNumbers(){
    const [rows] = await pool.query("SELECT * FROM clickNumbers")
    return rows
}

export async function getClickNumber(click_number_id){
    const [rows] = await pool.query(`
        SELECT * 
        FROM clickNumbers
        WHERE click_number_id = ?
        `, [click_number_id])
    return rows[0]
}

export async function createClickNumber(member_id, bookmark_id) {
    const [result] = await pool.query(`
        INSERT INTO clickNumbers (member_id, bookmark_id)    
        values (?, ?)
    `, [member_id, bookmark_id])
    const click_number_id = result.insertId
    return getClickNumber(click_number_id)
}

export async function deleteClickNumber(click_number_id){
    const [rows] = await pool.query(`
        DELETE 
        FROM clickNumbers
        WHERE click_number_id = ?
        `, [click_number_id])
    return rows
}

export async function setClickNumber(click_number_id, number) {
    const [rows] = await pool.query(`
        UPDATE clickNumbers
        SET number = ?
        WHERE click_number_id = ?
        `, [number, click_number_id])
    return rows[0]
}

// ----- Managers -----

export async function getManagers(){
    const [rows] = await pool.query("SELECT * FROM managers")
    return rows
}

export async function getManager(manager_id){
    const [rows] = await pool.query(`
        SELECT * 
        FROM managers
        WHERE manager_id = ?
        `, [manager_id])
    return rows[0]
}

export async function createManager(email, manager_password) {
    const [result] = await pool.query(`
        INSERT INTO managers (email, manager_password)    
        values (?, ?)
    `, [email, manager_password])
    const manager_id = result.insertId
    return getManager(manager_id)
}

export async function deleteManager(manager_id){
    const [rows] = await pool.query(`
        DELETE 
        FROM managers
        WHERE manager_id = ?
        `, [manager_id])
    return rows
}

export async function changeManagerPassword(manager_id, manager_password) {
    const [rows] = await pool.query(`
        UPDATE managers
        SET manager_password = ?
        WHERE manager_id = ?
        `, [manager_password, manager_id])
    return rows[0]
}


// ----- Reports -----

export async function getReports(){
    const [rows] = await pool.query("SELECT * FROM reports")
    return rows
}

export async function getReport(report_id){
    const [rows] = await pool.query(`
        SELECT * 
        FROM reports
        WHERE report_id = ?
        `, [report_id])
    return rows[0]
}

export async function createReport(user_id, bookmark_id, reason) {
    const [result] = await pool.query(`
        INSERT INTO reports (user_id, bookmark_id, reason)    
        values (?, ?, ?)
    `, [user_id, bookmark_id, reason])
    const report_id = result.insertId
    return getReport(report_id)
}

export async function deleteReport(report_id){
    const [rows] = await pool.query(`
        DELETE 
        FROM reports
        WHERE report_id = ?
        `, [report_id])
    return rows
}