import multer from "multer"
import fs from "fs"

const storage = multer.diskStorage({
    destination: function(req, res, cb){
        const path = "./public/temp"
        fs.mkdirSync(path, {recursive: true})
        cb(null, path)
    },
    filename: function(req, file, cb){
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

const upload = multer({
    storage: storage,
    fileFilter:(req, file, cb)=>{
        console.log('uploading file', file)
        cb(null, true)
    }
})

export {upload}