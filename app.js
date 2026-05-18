import express from "express";
import { getUsers, getUser, getUserByEmail, createUser, deleteUser, changePassword, 
    getFolders, getFolderByUser, getFolderByID, getMyFolder, createFolder, deleteFolder, updateFolder,
    getBookmarks, getBookmark, getBookmarkByID, createBookmark, deleteBookmark, updateBookmark,
    getMembers, getMember, getMemberByID, createMember, deleteMember, updateMember,
    getDomains, getDomain, getDomainByID, createDomain, deleteDomain,
    getFilters, getFilter, getFilterByID, createFilter, deleteFilter,
    getClickNumbers, getClickNumber, createClickNumber, deleteClickNumber, setClickNumber,
    getManagers, getManager, createManager, deleteManager, changeManagerPassword,
    getReports, getReport, createReport, deleteReport} from './database.js'
import cors from 'cors';
import path from 'path'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { authenticateToken } from "./middleware/auth.js";

const app = express()
const JWT_SECRET = process.env.JWT_SECRET

app.use(express.json())
app.use(cors());

app.get("/", async (req, res) => {
    res.send('Baza danych biblioteka_db')
})

// ----- Users -----

app.get("/users", authenticateToken, async (req, res) => {
    const users = await getUsers()
    res.send(users)
})

app.get("/users/:user_id", authenticateToken, async (req, res) => {
    const user_id = req.params.user_id
    const user = await getUser(user_id)
    res.send(user)
})

app.post("/users", authenticateToken, async (req, res) => {
    const { email, user_password } = req.body
    const user = await createUser(email, user_password)
    res.status(201).send(user)
})

app.delete("/users/:user_id", authenticateToken, async (req, res) => {
    const user_id = req.params.user_id
    const user = await deleteUser(user_id)
    res.status(204).send(user)
})

app.put("/users/:user_id", authenticateToken, async (req, res) => {
    const user_id = req.params.user_id
    const { user_password } = req.body
    const user = await changePassword(user_id, user_password)
    res.status(200).send(user)
})

// ----- Login -----

app.post("/login", async (req, res) => {
    const { email, user_password } = req.body
    const user = await getUserByEmail(email)
    if (!user) {
        return res.status(401).send({
            message: "Nieprawidłowy email lub hasło."
        })
    }

    const passwordMatch = await bcrypt.compare(
        user_password,
        user.user_password
    )

    if (!passwordMatch) {
        return res.status(401).send({
            message: "Nieprawidłowy email lub hasło."
        })
    }

    const token = jwt.sign(
        {
            user_id:user.user_id,
            email: user.email
        },
        JWT_SECRET,
        { expiresIn: "1h" }
    )
    res.send({
        token,
        user: {
            user_id:user.user_id,
            email: user.email
        }
    })
})


// ----- Folders -----

app.get("/folders", async (req, res) => {
    const folders = await getFolders()
    res.send(folders)
})

app.get("/folders/:creator_id", async (req, res) => {
    const user_id = req.params.creator_id
    const folder = await getFolderByUser(user_id)
    res.send(folder)
})

app.get("/folder/:folder_id", async (req, res) => {
    const folder_id = req.params.folder_id
    const folder = await getFolderByID(folder_id)
    res.send(folder)
})

app.get("/myfolders", authenticateToken, async (req, res) => {
    const user_id = req.user.user_id
    const folders = await getFolderByUser(user_id)
    res.send(folders)
})
app.get("/myfolders/:folder_id", authenticateToken, async (req, res) => {
    const folder_id = req.params.folder_id
    const user_id = req.user.user_id
    const folder = await getMyFolder(folder_id, user_id)

    if (!folder){
        return res.status(404).send({
            message: "Nie znaleziono folderu."
        })
    }

    res.send(folder)
})

/*
app.get("/folders/:folder_id", async (req, res) => {
    const folder_id = req.params.folder_id
    const folder = await getFolder(folder_id)
    res.send(folder)
})
*/

app.post("/folders", async (req, res) => {
    const { creator_id, name, visibility, member_privileges } = req.body
    const folder = await createFolder(creator_id, name, visibility, member_privileges)
    res.status(201).send(folder)
})

app.post("/myfolders", authenticateToken, async (req, res) => {
    const creator_id = req.user.user_id
    const { name, visibility, member_privileges } = req.body
    const folder = await createFolder(creator_id, name, visibility, member_privileges)
    res.status(201).send(folder)
})

app.delete("/folders/:folder_id", async (req, res) => {
    const folder_id = req.params.folder_id
    const folder = await deleteFolder(folder_id)
    res.status(204).send(folder)
})

app.put("/folders/:folder_id", async (req, res) => {
    const folder_id = req.params.folder_id
    const { name, visibility, member_privileges } = req.body
    const folder = await updateFolder(folder_id, name, visibility, member_privileges)
    res.status(200).send(folder)
})


// ----- Bookmarks -----

app.get("/bookmarks", async (req, res) => {
    const bookmarks = await getBookmarks()
    res.send(bookmarks)
})
/*
app.get("/bookmarks/:bookmark_id", async (req, res) => {
    const bookmark_id = req.params.bookmark_id
    const bookmark = await getBookmark(bookmark_id)
    res.send(bookmark)
})
*/
app.get("/bookmarks/:folder_id", async (req, res) => {
    const folder_id = req.params.folder_id
    const bookmark = await getBookmark(folder_id)
    res.send(bookmark)
})

app.get("/bookmark/:bookmark_id", async (req, res) => {
    const bookmark_id = req.params.bookmark_id
    const bookmark = await getBookmarkByID(bookmark_id)
    res.send(bookmark)
})

app.post("/bookmarks", async (req, res) => {
    const { folder_id, link } = req.body
    if (!link) {
        return res.status(400).send({
            message: "Potrzeba linku"
        })
    }

    try {

        const url = new URL(link)

        if (
            url.protocol !== "http:" &&
            url.protocol !== "https:"
        ) {

            return res.status(400).send({
                message: "Only HTTP/HTTPS links allowed"
            })
        }

    } catch {

        return res.status(400).send({
            message: "Invalid URL"
        })
    }

    const bookmark = await createBookmark(folder_id, link)
    res.status(201).send(bookmark)
})

app.delete("/bookmarks/:bookmark_id", async (req, res) => {
    const bookmark_id = req.params.bookmark_id
    const bookmark = await deleteBookmark(bookmark_id)
    res.status(204).send(bookmark)
})

app.put("/bookmarks/:bookmark_id", async (req, res) => {
    const bookmark_id = req.params.bookmark_id
    const { scheduler, change_date, page_status } = req.body
    const bookmark = await updateBookmark(bookmark_id, scheduler, change_date, page_status)
    res.status(200).send(bookmark)
})

// ----- Members -----

app.get("/members", async (req, res) => {
    const members = await getMembers()
    res.send(members)
})

app.get("/members/:folder_id", async (req, res) => {
    const folder_id = req.params.folder_id
    const members = await getMember(folder_id)
    res.send(members)
})

app.get("/member/:member_id", async (req, res) => {
    const member_id = req.params.member_id
    const member = await getMemberByID(member_id)
    res.send(member)
})

app.post("/members", async (req, res) => {
    const { folder_id, user_id } = req.body
    const member = await createMember(folder_id, user_id)
    res.status(201).send(member)
})

app.delete("/members/:member_id", async (req, res) => {
    const member_id = req.params.member_id
    const member = await deleteMember(member_id)
    res.status(204).send(member)
})

app.put("/members", async (req, res) => {
    const { member_id, role, filter_type } = req.body
    const member = await updateMember(member_id, role, filter_type)
    res.status(200).send(member)
})


// ----- Domains -----

app.get("/domains", async (req, res) => {
    const domains = await getDomains()
    res.send(domains)
})

app.get("/domains/:folder_id", async (req, res) => {
    const folder_id = req.params.folder_id
    const domain = await getDomain(folder_id)
    res.send(domain)
})

app.post("/domains", async (req, res) => {
    const { folder_id, domain } = req.body
    const domain_result = await createDomain(folder_id, domain)
    res.status(201).send(domain_result)
})

app.delete("/domains/:domain_id", async (req, res) => {
    const domain_id = req.params.domain_id
    const domain = await deleteDomain(domain_id)
    res.status(204).send(domain)
})

// ----- Filters -----

app.get("/filters", async (req, res) => {
    const filter = await getFilters()
    res.send(filter)
})

app.get("/filters/:folder_id", async (req, res) => {
    const folder_id = req.params.folder_id
    const filter = await getFilter(folder_id)
    res.send(filter)
})

app.post("/filters", async (req, res) => {
    const { folder_id, filtered_phrase } = req.body
    const filter = await createFilter(folder_id, filtered_phrase)
    res.status(201).send(filter)
})

app.delete("/filters/:filter_id", async (req, res) => {
    const filter_id = req.params.filter_id
    const filter = await deleteFilter(filter_id)
    res.status(204).send(filter)
})

// ----- Click Numbers -----

app.get("/click_numbers", async (req, res) => {
    const click_numbers = await getClickNumbers()
    res.send(click_numbers)
})

app.get("/click_numbers/:click_number_id", async (req, res) => {
    const click_number_id = req.params.click_number_id
    const click_number = await getClickNumber(click_number_id)
    res.send(click_number)
})

app.post("/click_numbers", async (req, res) => {
    const { member_id, bookmark_id } = req.body
    const click_number = await createClickNumber(member_id, bookmark_id)
    res.status(201).send(click_number)
})

app.delete("/click_numbers/:click_number_id", async (req, res) => {
    const click_number_id = req.params.click_number_id
    const click_number = await deleteClickNumber(click_number_id)
    res.status(204).send(click_number)
})

app.put("/click_numbers", async (req, res) => {
    const { click_number_id, number } = req.body
    const click_number = await setClickNumber(click_number_id, number)
    res.status(200).send(click_number)
})

// ----- Managers -----

app.get("/managers", async (req, res) => {
    const managers = await getManagers()
    res.send(managers)
})

app.get("/managers/:manager_id", async (req, res) => {
    const manager_id = req.params.manager_id
    const manager = await getManager(manager_id)
    res.send(manager)
})

app.post("/managers", async (req, res) => {
    const { email, manager_password } = req.body
    const manager = await createManager(email, manager_password)
    res.status(201).send(manager)
})

app.delete("/managers/:manager_id", async (req, res) => {
    const manager_id = req.params.manager_id
    const manager = await deleteManager(manager_id)
    res.status(204).send(manager)
})

// ----- Reports -----

app.get("/reports", async (req, res) => {
    const reports = await getReports()
    res.send(reports)
})

app.get("/reports/:report_id", async (req, res) => {
    const report_id = req.params.report_id
    const report = await getReport(report_id)
    res.send(report)
})

app.post("/reports", async (req, res) => {
    const { user_id, bookmark_id, reason } = req.body
    const report = await createReport(user_id, bookmark_id, reason)
    res.status(201).send(report)
})

app.delete("/reports/:report_id", async (req, res) => {
    const report_id = req.params.report_id
    const report = await deleteReport(report_id)
    res.status(204).send(report)
})

// Error

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something went wrong.')
})

app.listen(8080, () => {
  console.log(`Server is running on port 8080`)
})