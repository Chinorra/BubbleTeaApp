const multer = require('multer')

const allowType = ['png', 'jpg', 'jpeg'];

const storage = multer.diskStorage ({
    destination: (req, file, cb) => {
        cb(null, 'statics')
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const spiltFileName = file.originalname.split('.');
        const fileType = spiltFileName[spiltFileName.length - 1];

        const fileSize = parseInt(req.headers["content-length"])
        if (fileSize > 1024 * 1024) {
           return cb('file too large to upload', null)
        }
        console.log('fileSize:', fileSize);
        console.log('file: ', file);
        if(allowType.includes(fileType)) {
             cb(null, `${req.params.user_id}.${fileType}`)
        } else {
            cb('type of file is not allow', null)
        }
    },
    
})

const upload = multer({ 
    storage: storage,
    limits: {fieldSize: 1024 * 1024 }
}).single('avatar')

module.exports = upload