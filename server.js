var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var mysql = require('mysql');
var bodyParser = require("body-parser");
var multer = require('multer');
var crypto = require('crypto');
var s = require('multer');


var connection = mysql.createConnection({
    host : 'sibejoo.com',
    user : 'sibejoo1_cattloo',
    password : 'sibejoo1_cattloo',
    database : 'sibejoo1_cattloo',
    });

// var connection = mysql.createConnection({
//     host : 'localhost',
//     user : 'root',
//     password : '',
//     database : 'db_cattloo',
// });
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

connection.connect(function (err) {
    if (!err){
        console.log("Database terkoneksi");
    } else {
        console.log("Database tidak terhubung");
    }
})

var storage = multer.diskStorage({
    destination: './image/transaksi',
    filename: function(req, file, cb) {
        return crypto.pseudoRandomBytes(16, function(err, raw) {
            if (err) {
                return cb(err);
            }
            return cb(null, "" + (raw.toString('hex')) + (path.extname(file.originalname)));
        });
    }


});

app.get('/',function(req,res){
    var data = {
        "Data":""
    };
    data["Data"] = "Hello Cattloo";
    res.json(data);
});


//upload poto
app.post('/uploadFoto', multer({storage: storage}).single('upload'), function(req, res) {
    console.log(req.file);
    console.log(req.body);
    console.log("sebelum di isi : "+s);
    s = req.file.filename;
    console.log("yaaaannggggg  iniiiiiiiiiiiiii "+s);
    return res.status(204).end(), res.s;
});

// Add data invoidce
app.post('/addInvoice',function (req,res){

    var kodeInvoice = req.body.kode_invoice;
    var buktiTransfer = "http://localhost:5500/image/transaksi/"+s;
    var tglBayar = req.body.tgl_bayar;
    var nominal = req.body.nominal;
    var idBelanja = req.body.id_belanja;
    var namaPemilikRekening= req.body.nama_pemilik_rekening;
    var bankPengirim = req.body.bank_pengirim;
    var data ={
        "error":1,
        "Add Invoice":""
    };
    if(!!buktiTransfer && !!tglBayar && !!nominal && !!idBelanja && !!namaPemilikRekening && !!bankPengirim){
        connection.query("INSERT INTO invoice VALUES(?,?,?,?,?,?,?)",[kodeInvoice,buktiTransfer,tglBayar,nominal,idBelanja,namaPemilikRekening,bankPengirim],function(err,rows,fields){
            if(!!err){
                data["Invoice"] = "kesalahan penambahan invoice";
                console.log("masuk ke error");
                console.log("yaaaannggggg  itu "+s);
                console.log("file jpg"+s);
                ;
            }else{
                data["error"] = 0;
                data["Invoice"] = "Data invoice telah berhasil ditambahkan";
                console.log("yaaaannggggg  itu "+buktiTransfer);
                console.log("file jpg"+s);
            }
            res.json(data);
        });
        console.log("file jpg buat disimpen didb : "+buktiTransfer);
    }else{
        data["Informasi"] = "inputkan data berdasarkan (i.e : )";
        res.json(data);
    }
});

// Mengambil data hewan
app.get('/getHewan',function (req,res) {
    var data = {
    };
    connection.query("SELECT id_spesies_hewan as id_hewan,  nama_jenis_hewan as jenis_hewan, nama_spesies_hewan as spesies from spesies_hewan, jenis_hewan " +
        "where spesies_hewan.id_jenis_hewan = jenis_hewan.id_jenis_hewan group by nama_jenis_hewan", function (err, rows, fields) {
        if (rows.length !=0){
            data["Hewan"] = rows;
            res.json(data);
        } else{
            data["Hewan"] = 'Tidak Ada Data Surat Pengantar';
            res.json(data);
        }
    })
});

// Mengambil data user
app.get('/getUser',function (req,res) {
    var data = {
    };
    connection.query("SELECT * from user", function (err, rows, fields) {
        if (rows.length !=0){
            data["User"] = rows;
            res.json(data);
        } else{
            data["Hewan"] = 'Tidak Ada data Warga...';
            res.json(data);
        }
    })
});

// Mengambil data user
app.get('/login',function (req,res) {
    var data = {
    };
    connection.query("SELECT * from user where username='"+req.query.username+"' and password='"+req.query.password+"' and hak_akses = 0", function (err, rows, fields) {
        if (rows.length !=0){
            data["User"] = rows;
            res.json(data);
        } else{
            data["Hewan"] = 'Tidak Ada data Warga...';
            res.json(data);
        }
    })
});


//Add User
app.post('/addUser', function (req,res) {
    var idUser = req.body.id_user;
    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.email;
    var noTelepon = req.body.no_telepon;
    var namaDepan = req.body.nama_depan;
    var namaBelakang = req.body.nama_belakang;
    var foto = req.body.foto;
    var hakAkses = 0;
    var data ={
    };

    if(!!username && !!password && !!email && !!noTelepon && !!namaDepan && !!namaBelakang ){
        connection.query("INSERT INTO user VALUES(?,?,?,?,?,?,?,?,?)",[idUser,username,password,email,noTelepon,namaDepan,namaBelakang,foto,hakAkses],function(err,rows,fields){
            if(!!err){
                data["Informasi"] = "kesalahan penambahan akun";
            }else{
                data["error"] = 0;
                data["User"] = "Data akun telah berhasil ditambahkan";
            }
            res.json(data);
        });
    }else{
        data["Informasi"] = "inputkan data berdasarkan (i.e : )";
        res.json(data);
    }

});

// Mengambil data user
app.get('/getUser',function (req,res) {
    var data = {
    };
    connection.query("SELECT * from user", function (err, rows, fields) {
        if (rows.length !=0){
            data["User"] = rows;
            res.json(data);
        } else{
            data["Hewan"] = 'Tidak Ada data Warga...';
            res.json(data);
        }
    })
});

// Mengambil data hewan by ID
app.get('/getHewanID',function (req,res) {
    var data = {
    };
    connection.query("SELECT id_spesies_hewan, nama_spesies_hewan, nama_jenis_hewan from spesies_hewan, jenis_hewan " +
        "where spesies_hewan.nama_spesies_hewan ='"+ req.query.nama_spesies_hewan+"' " +
        "and spesies_hewan.id_jenis_hewan = jenis_hewan.id_jenis_hewan", function (err, rows, fields) {
        if (rows.length !=0){
            data["Hewan"] = rows;
            res.json(data);
        } else{
            data["Hewan"] = 'Tidak ada hewan yang dicari';
            res.json(data);
        }
    })
});

//Mengambil data ternak untuk pos di pasar
// Mengambil data hewan by ID
app.get('/getPasar',function (req,res) {
    var data = {
    };
        connection.query("SELECT user.id_user, user.nama_depan, user.nama_belakang, user.no_telepon, ternak.id_ternak, jenis_hewan.nama_jenis_hewan as jenis_hewan, spesies_hewan.nama_spesies_hewan as spesies, " +
            "kabupaten_kota.name as nama_daerah, visual.foto_1, visual.foto_2, visual.foto_3, visual.url_video, visual.harga, ternak.deskripsi  " +
            "FROM visual, ternak,  jenis_hewan, spesies_hewan, user, kecamatan, kandang, kabupaten_kota " +
            "WHERE visual.id_ternak = ternak.id_ternak and ternak.id_spesies_hewan = spesies_hewan.id_spesies_hewan " +
            "and spesies_hewan.id_jenis_hewan = jenis_hewan.id_jenis_hewan and ternak.id_user = user.id_user " +
            "and kecamatan.id = kandang.id_kecamatan and kandang.id_kandang = ternak.id_kandang " +
            "and ternak.status_pasar = 1 and kabupaten_kota.id = kecamatan.regency_id " +
            "AND visual.tgl_periksa IN ( SELECT MAX( tgl_periksa ) FROM  visual GROUP BY visual.id_ternak)", function (err, rows, fields) {
        if (rows.length !=0){
            data["Pasar"] = rows;
            res.json(data);
        } else{
            data["Hewan"] = 'Tidak ada hewan yang dicari';
            res.json(data);
        }
    })
});

// Mengambil data hewan by ID
app.get('/getPasarByHewan',function (req,res) {
    var data = {
    };
    connection.query("SELECT user.id_user, user.nama_depan, user.nama_belakang, user.no_telepon, ternak.id_ternak, jenis_hewan.nama_jenis_hewan as jenis_hewan, spesies_hewan.nama_spesies_hewan as spesies, " +
        "kabupaten_kota.name as nama_daerah, visual.foto_1, visual.foto_2, visual.foto_3, visual.url_video, visual.harga, ternak.deskripsi " +
        "FROM visual, ternak,  jenis_hewan, spesies_hewan, user, kecamatan, kandang, kabupaten_kota " +
        "WHERE visual.id_ternak = ternak.id_ternak and ternak.id_spesies_hewan = spesies_hewan.id_spesies_hewan " +
        "and spesies_hewan.id_jenis_hewan = jenis_hewan.id_jenis_hewan and ternak.id_user = user.id_user " +
        "and kecamatan.id = kandang.id_kecamatan and kandang.id_kandang = ternak.id_kandang " +
        "and ternak.status_pasar = 1 and kabupaten_kota.id = kecamatan.regency_id " +
        "and jenis_hewan.nama_jenis_hewan ='"+req.query.nama_jenis_hewan+"' "+
        "AND visual.tgl_periksa IN ( SELECT MAX( tgl_periksa ) FROM  visual GROUP BY visual.id_ternak)", function (err, rows, fields) {
        if (rows.length !=0){
            data["Pasar"] = rows;
            res.json(data);
        } else{
            data["Hewan"] = 'Tidak ada hewan yang dicari';
            res.json(data);
        }
    })
});

// Mengambil data hewan by ID
app.get('/getPasarByLokasi',function (req,res) {
    var data = {
    };
    connection.query("SELECT user.id_user, user.nama_depan, user.nama_belakang, user.no_telepon, ternak.id_ternak, jenis_hewan.nama_jenis_hewan as jenis_hewan, spesies_hewan.nama_spesies_hewan as spesies, " +
        "kabupaten_kota.name as nama_daerah, visual.foto_1, visual.foto_2, visual.foto_3, visual.url_video, visual.harga, ternak.deskripsi " +
        "FROM visual, ternak,  jenis_hewan, spesies_hewan, user, kecamatan, kandang, kabupaten_kota " +
        "WHERE visual.id_ternak = ternak.id_ternak and ternak.id_spesies_hewan = spesies_hewan.id_spesies_hewan " +
        "and spesies_hewan.id_jenis_hewan = jenis_hewan.id_jenis_hewan and ternak.id_user = user.id_user " +
        "and kecamatan.id = kandang.id_kecamatan and kandang.id_kandang = ternak.id_kandang " +
        "and ternak.status_pasar = 1 and kabupaten_kota.id = kecamatan.regency_id " +
        "and kabupaten_kota.name ='"+req.query.name+"' "+
        "AND visual.tgl_periksa IN ( SELECT MAX( tgl_periksa ) FROM  visual GROUP BY visual.id_ternak)", function (err, rows, fields) {
        if (rows.length !=0){
            data["Pasar"] = rows;
            res.json(data);
        } else{
            data["Hewan"] = 'Tidak ada hewan yang dicari';
            res.json(data);
        }
    })
});

// Mengambil data hewan by between 0 - 10jt
app.get('/getPasarByBetween1',function (req,res) {
    var data = {
    };
    connection.query("SELECT user.id_user, user.nama_depan, user.nama_belakang, user.no_telepon, ternak.id_ternak, jenis_hewan.nama_jenis_hewan as jenis_hewan, spesies_hewan.nama_spesies_hewan as spesies, " +
        "kabupaten_kota.name as nama_daerah, visual.foto_1, visual.foto_2, visual.foto_3, visual.url_video, visual.harga, ternak.deskripsi " +
        "FROM visual, ternak,  jenis_hewan, spesies_hewan, user, kecamatan, kandang, kabupaten_kota " +
        "WHERE visual.id_ternak = ternak.id_ternak " +
        "and ternak.id_spesies_hewan = spesies_hewan.id_spesies_hewan " +
        "and spesies_hewan.id_jenis_hewan = jenis_hewan.id_jenis_hewan " +
        "and ternak.id_user = user.id_user " +
        "and kecamatan.id = kandang.id_kecamatan " +
        "and kandang.id_kandang = ternak.id_kandang " +
        "and ternak.status_pasar = 1 and kabupaten_kota.id = kecamatan.regency_id " +
        "and visual.harga BETWEEN 0 AND 10000000 " +
        "AND visual.tgl_periksa IN ( SELECT MAX( tgl_periksa ) FROM  visual GROUP BY visual.id_ternak)", function (err, rows, fields) {
        if (rows.length !=0){
            data["Pasar"] = rows;
            res.json(data);
        } else{
            data["Hewan"] = 'Tidak ada hewan yang dicari';
            res.json(data);
        }
    })
});

// Mengambil data hewan by between 10jt - 20jt
app.get('/getPasarByBetween2',function (req,res) {
    var data = {
    };
    connection.query("SELECT user.id_user, user.nama_depan, user.nama_belakang, user.no_telepon, ternak.id_ternak, jenis_hewan.nama_jenis_hewan as jenis_hewan, spesies_hewan.nama_spesies_hewan as spesies, " +
        "kabupaten_kota.name as nama_daerah, visual.foto_1, visual.foto_2, visual.foto_3, visual.url_video, visual.harga, ternak.deskripsi " +
        "FROM visual, ternak,  jenis_hewan, spesies_hewan, user, kecamatan, kandang, kabupaten_kota " +
        "WHERE visual.id_ternak = ternak.id_ternak " +
        "and ternak.id_spesies_hewan = spesies_hewan.id_spesies_hewan " +
        "and spesies_hewan.id_jenis_hewan = jenis_hewan.id_jenis_hewan " +
        "and ternak.id_user = user.id_user " +
        "and kecamatan.id = kandang.id_kecamatan " +
        "and kandang.id_kandang = ternak.id_kandang " +
        "and ternak.status_pasar = 1 and kabupaten_kota.id = kecamatan.regency_id " +
        "and visual.harga BETWEEN 10000000 AND 20000000 " +
        "AND visual.tgl_periksa IN ( SELECT MAX( tgl_periksa ) FROM  visual GROUP BY visual.id_ternak)", function (err, rows, fields) {
        if (rows.length !=0){
            data["Pasar"] = rows;
            res.json(data);
        } else{
            data["Hewan"] = 'Tidak ada hewan yang dicari';
            res.json(data);
        }
    })
});


// Mengambil data hewan by between 20jt - 30jt
app.get('/getPasarByBetween3',function (req,res) {
    var data = {
    };
    connection.query("SELECT user.id_user, user.nama_depan, user.nama_belakang, user.no_telepon, ternak.id_ternak, jenis_hewan.nama_jenis_hewan as jenis_hewan, spesies_hewan.nama_spesies_hewan as spesies, " +
        "kabupaten_kota.name as nama_daerah, visual.foto_1, visual.foto_2, visual.foto_3, visual.url_video, visual.harga, ternak.deskripsi " +
        "FROM visual, ternak,  jenis_hewan, spesies_hewan, user, kecamatan, kandang, kabupaten_kota " +
        "WHERE visual.id_ternak = ternak.id_ternak " +
        "and ternak.id_spesies_hewan = spesies_hewan.id_spesies_hewan " +
        "and spesies_hewan.id_jenis_hewan = jenis_hewan.id_jenis_hewan " +
        "and ternak.id_user = user.id_user " +
        "and kecamatan.id = kandang.id_kecamatan " +
        "and kandang.id_kandang = ternak.id_kandang " +
        "and ternak.status_pasar = 1 and kabupaten_kota.id = kecamatan.regency_id " +
        "and visual.harga BETWEEN 20000000 AND 30000000 " +
        "AND visual.tgl_periksa IN ( SELECT MAX( tgl_periksa ) FROM  visual GROUP BY visual.id_ternak)", function (err, rows, fields) {
        if (rows.length !=0){
            data["Pasar"] = rows;
            res.json(data);
        } else{
            data["Hewan"] = 'Tidak ada hewan yang dicari';
            res.json(data);
        }
    })
});

// Mengambil data hewan by between > 30jt
app.get('/getPasarByBetween4',function (req,res) {
    var data = {
    };
    connection.query("SELECT user.id_user, user.nama_depan, user.nama_belakang, user.no_telepon, ternak.id_ternak, jenis_hewan.nama_jenis_hewan as jenis_hewan, spesies_hewan.nama_spesies_hewan as spesies, " +
        "kabupaten_kota.name as nama_daerah, visual.foto_1, visual.foto_2, visual.foto_3, visual.url_video, visual.harga, ternak.deskripsi " +
        "FROM visual, ternak,  jenis_hewan, spesies_hewan, user, kecamatan, kandang, kabupaten_kota " +
        "WHERE visual.id_ternak = ternak.id_ternak " +
        "and ternak.id_spesies_hewan = spesies_hewan.id_spesies_hewan " +
        "and spesies_hewan.id_jenis_hewan = jenis_hewan.id_jenis_hewan " +
        "and ternak.id_user = user.id_user " +
        "and kecamatan.id = kandang.id_kecamatan " +
        "and kandang.id_kandang = ternak.id_kandang " +
        "and ternak.status_pasar = 1 and kabupaten_kota.id = kecamatan.regency_id " +
        "and visual.harga > 30000000 " +
        "AND visual.tgl_periksa IN ( SELECT MAX( tgl_periksa ) FROM  visual GROUP BY visual.id_ternak)", function (err, rows, fields) {
        if (rows.length !=0){
            data["Pasar"] = rows;
            res.json(data);
        } else{
            data["Hewan"] = 'Tidak ada hewan yang dicari';
            res.json(data);
        }
    })
});

// get sampel
app.get('/getSampel',function (req,res) {
    var data = {
    };
    connection.query("SELECT sampel.kode_sampel, sampel.foto_1, bobot, panjang, tinggi, sampel.foto_2, sampel.foto_3, sampel.url_video, " +
        "sampel.deskripsi, sampel.cara_ternak, jenis_hewan.nama_jenis_hewan as jenis_hewan, spesies_hewan.nama_spesies_hewan as spesies, sampel.harga " +
        "FROM sampel, jenis_hewan, spesies_hewan " +
        "WHERE spesies_hewan.id_spesies_hewan = sampel.id_spesies " +
        "AND jenis_hewan.id_jenis_hewan = spesies_hewan.id_jenis_hewan", function (err, rows, fields) {
        if (rows.length !=0){
            data["Sampel"] = rows;
            res.json(data);
        } else{
            data["Hewan"] = 'Tidak ada hewan yang dicari';
            res.json(data);
        }
    })
});


//getPesan
app.get('/getPesan',function (req,res) {
    var data = {
    };
    connection.query("SELECT kode_pesan, kode_sampel, id_user, DATE_FORMAT(`tgl_pesan`, '%d-%m-%Y') as tgl_pesan, status_pesan, jumlah_ekor from pesan ", function (err, rows, fields) {
        if (rows.length !=0){
            data["Pesan"] = rows;
            res.json(data);
        } else{
            data["Pesan"] = 'Tidak Ada Pesan...';
            res.json(data);
        }
    })
});

//getPesananByID
app.get('/getPesananID',function (req,res) {
    var data = {
    };
    connection.query("SELECT kode_pesan, sampel.kode_sampel, pesan.id_user, DATE_FORMAT(  `tgl_pesan` ,  '%d-%m-%Y' ) AS tgl_pesan, " +
        "status_pesan, jumlah_ekor, sampel.kode_sampel, sampel.foto_1, jenis_hewan.nama_jenis_hewan as jenis_hewan, spesies_hewan.nama_spesies_hewan as spesies" +
        " FROM pesan, sampel, user, jenis_hewan, spesies_hewan" +
        " WHERE sampel.kode_sampel = pesan.kode_sampel" +
        " AND user.id_user = pesan.id_user " +
        " AND jenis_hewan.id_jenis_hewan = spesies_hewan.id_jenis_hewan AND spesies_hewan.id_spesies_hewan = sampel.id_spesies" +
        " AND pesan.id_user = " + req.query.id_user +
        " ORDER BY tgl_pesan DESC  ", function (err, rows, fields) {
        if (rows.length !=0){
            data["Pesanan"] = rows;
            res.json(data);
        } else{
            data["Pesan"] = 'Tidak Ada Pesan...';
            res.json(data);
        }
    })
});

//getKota
app.get('/getKota',function (req,res) {
    var data = {
    };
    connection.query("SELECT kabupaten_kota.id as id_lokasi, kabupaten_kota.name AS nama_daerah, provinsi.name AS nama_provinsi " +
        "FROM kecamatan, kabupaten_kota, provinsi " +
        "WHERE provinsi.id = kabupaten_kota.province_id AND kabupaten_kota.id = kecamatan.regency_id " +
        "GROUP BY kabupaten_kota.name", function (err, rows, fields) {
        if (rows.length !=0){
            data["Kota"] = rows;
            res.json(data);
        } else{
            data["Pesan"] = 'Tidak Ada Pesan...';
            res.json(data);
        }
    })
});


// Add pesan
app.post('/addPesan',function (req,res){
    var kodePesan = req.body.kode_pesan;
    var kodeSampel = req.body.kode_sampel;
    var idUser = req.body.id_user;
    var tglPesan = req.body.tgl_pesan;
    var statusPesan = req.body.status_pesan;
    var jumlahEkor = req.body.jumlah_ekor;
    var data ={
    };
    if(!!kodePesan && !!kodeSampel && !!idUser && !!tglPesan && !!statusPesan ){
        connection.query("INSERT INTO pesan VALUES(?,?,?,?,?,?,?,?)",[kodePesan,kodeSampel,idUser,tglPesan,statusPesan,jumlahEkor,0,0],function(err,rows,fields){
            if(!!err){
                data["Pesan"] = "kesalahan penambahan akun";
            }else{
                data["error"] = 0;
                data["Pesan"] = "Data akun telah berhasil ditambahkan";
            }
            res.json(data);
        });
    }else{
        data["Informasi"] = "inputkan data berdasarkan (i.e : )";
        res.json(data);
    }
});

// Delete pesan
app.post('/hapusPesan',function (req,res){
    var kodePesan = req.body.kode_pesan;
    var data ={
    };
    if(!!kodePesan){
        connection.query("DELETE from pesan where kode_pesan = ?",[kodePesan],function(err,rows,fields){
            if(!!err){
                data["Pesan"] = "kesalahan penambahan akun";
            }else{
                data["error"] = 0;
                data["Pesan"] = "Data akun telah berhasil ditambahkan";
            }
            res.json(data);
        });
    }else{
        data["Informasi"] = "inputkan data berdasarkan (i.e : )";
        res.json(data);
    }
});

//getBelanjaByID
app.get('/getBelanjaByID',function (req,res) {
    var data = {
    };
    connection.query("SELECT * from belanja_ternak where id_user = "+req.query.id_user+" and id_ternak = "+req.query.id_ternak, function (err, rows, fields) {
        if (rows.length !=0){
            data["Belanja"] = rows;
            res.json(data);
        } else{
            data["Pesan"] = 'Tidak Ada Pesan...';
            res.json(data);
        }
    })
});

//getBelanjaByIDUser
app.get('/getBelanjaByPembeli',function (req,res) {
    var data = {
    };
    connection.query("SELECT * from belanja_ternak where id_user = "+req.query.id_user, function (err, rows, fields) {
        if (rows.length !=0){
            data["Belanja"] = rows;
            res.json(data);
        } else{
            data["Pesan"] = 'Tidak Ada Pesan...';
            res.json(data);
        }
    })
});

// Mengambil data hewan by ID ternak
app.get('/getTernakByID',function (req,res) {
    var data = {
    };
    connection.query("SELECT user.id_user, user.nama_depan, user.nama_belakang, user.no_telepon, ternak.id_ternak, jenis_hewan.nama_jenis_hewan, spesies_hewan.nama_spesies_hewan, kecamatan.name, visual.foto_1, visual.foto_2, visual.foto_3, visual.url_video, visual.harga, ternak.deskripsi " +
        "FROM visual, ternak, user, jenis_hewan, spesies_hewan, kecamatan, kandang " +
        "WHERE visual.id_ternak = ternak.id_ternak " +
        "AND user.id_user = ternak.id_user " +
        "AND ternak.id_kandang = kandang.id_kandang " +
        "AND kandang.id_kecamatan = kecamatan.id " +
        "AND ternak.id_spesies_hewan = spesies_hewan.id_spesies_hewan " +
        "AND spesies_hewan.id_jenis_hewan = jenis_hewan.id_jenis_hewan " +
        "AND ternak.status_pasar =1 " +
        "AND ternak.id_ternak ="+req.query.id_ternak+
        " AND visual.tgl_periksa IN (SELECT MAX( tgl_periksa ) FROM visual GROUP BY visual.id_ternak)", function (err, rows, fields) {
        if (rows.length !=0){
            data["Pasar"] = rows;
            res.json(data);
        } else{
            data["Hewan"] = 'Tidak ada hewan yang dicari';
            res.json(data);
        }
    })
});

// Mengambil data hewan by ID user
app.get('/getTernakByUser',function (req,res) {
    var data = {
    };
    connection.query("SELECT user.id_user, user.nama_depan, user.nama_belakang, user.no_telepon, ternak.id_ternak, jenis_hewan.nama_jenis_hewan as jenis_hewan," +
        " spesies_hewan.nama_spesies_hewan as spesies, kecamatan.name as nama_daerah, visual.foto_1, visual.foto_2, visual.foto_3, visual.url_video, visual.harga, ternak.deskripsi, ternak.cara_ternak, ternak.status_pasar, " +
        " peternak.nama_depan as nama_depan_peternak, peternak.nama_belakang as nama_belakang_peternak, " +
        " kandang.nama_kandang, asisten.nama_depan as nama_depan_asisten, asisten.nama_belakang as nama_belakang_asisten " +
        "FROM visual, ternak, user, jenis_hewan, spesies_hewan, kecamatan, kandang, peternak, asisten, asisten_ternak " +
        "WHERE visual.id_ternak = ternak.id_ternak " +
        "AND user.id_user = ternak.id_user " +
        "AND peternak.id_peternak = ternak.id_peternak  " +
        "AND asisten.id_asisten = asisten_ternak.id_asisten " +
        "AND ternak.id_ternak = asisten_ternak.id_ternak " +
        "AND kandang.id_kandang = ternak.id_kandang " +
        "AND kandang.id_kecamatan = kecamatan.id " +
        "AND ternak.id_spesies_hewan = spesies_hewan.id_spesies_hewan " +
        "AND spesies_hewan.id_jenis_hewan = jenis_hewan.id_jenis_hewan " +
        "AND ternak.id_user ="+req.query.id_user+
        " AND visual.tgl_periksa IN (SELECT MAX( tgl_periksa ) FROM visual GROUP BY visual.id_ternak)", function (err, rows, fields) {
        if (rows.length !=0){
            data["Ternakku"] = rows;
            res.json(data);
        } else{
            data["Hewan"] = 'Tidak ada hewan yang dicari';
            res.json(data);
        }
    })
});

// baru sampe sini yoo, besok dilanjut lagi yah :)

// Mengambil data visual by id ternak
app.get('/getVIsualByID',function (req,res) {
    var data = {
    };
    connection.query("SELECT ternak.id_ternak, spesies_hewan.nama_spesies_hewan as spesies, jenis_hewan.nama_jenis_hewan as jenis_hewan, " +
        "DATE_FORMAT( visual.tgl_periksa, '%d-%m-%Y' ) AS tgl_periksa, visual.bobot, visual.tinggi, visual.panjang, " +
        "visual.foto_1, visual.foto_2, visual.foto_3, visual.url_video, ternak.cara_ternak " +
        "FROM visual, spesies_hewan, jenis_hewan, ternak " +
        "WHERE ternak.id_spesies_hewan = spesies_hewan.id_spesies_hewan " +
        "AND spesies_hewan.id_jenis_hewan = jenis_hewan.id_jenis_hewan " +
        "AND ternak.id_ternak = visual.id_ternak " +
        "AND visual.id_ternak = "+req.query.id_ternak, function (err, rows, fields) {
        if (rows.length !=0){
            data["Visual"] = rows;
            res.json(data);
        } else{
            data["Hewan"] = 'Tidak ada hewan yang dicari';
            res.json(data);
        }
    })
});

//add Belanja
app.post('/addBelanja',function (req,res){
    var idBelanja = req.body.id_belanja;
    var tanggalBelanja = req.body.tanggal_belanja;
    var harga = req.body.harga;
    var idTernak = req.body.id_ternak;
    var statusBeli = req.body.status_beli;
    var idUser = req.body.id_user;
    var data ={
    };
    if(!!idBelanja && !!tanggalBelanja && !!harga && !!idTernak && !!statusBeli && !!idUser ){
        connection.query("INSERT INTO belanja_ternak VALUES(?,?,?,?,?,?)",[idBelanja,tanggalBelanja,harga,idTernak,statusBeli,idUser],function(err,rows,fields){
            if(!!err){
                data["Pesan"] = "kesalahan penambahan akun";
            }else{
                data["error"] = 0;
                data["Pesan"] = "Data akun telah berhasil ditambahkan";
            }
            res.json(data);
        });
    }else{
        data["Informasi"] = "inputkan data berdasarkan (i.e : )";
        res.json(data);
    }
});

//Mengambil data hewan by ID
app.get('/getBelanjaLaporan',function (req,res) {
    var data = {
    };
    connection.query("SELECT ternak.id_ternak, ternak.deskripsi, belanja_ternak.id_belanja, " +
        "DATE_FORMAT(  `tanggal_belanja` ,  '%d-%m-%Y' ) AS tanggal_belanja, belanja_ternak.id_user, " +
        "belanja_ternak.harga, ternak.status, user.nama_depan AS pembeli, visual.foto_1, belanja_ternak.status_beli " +
        "FROM ternak, belanja_ternak, user, visual  " +
        "WHERE ternak.id_ternak = belanja_ternak.id_ternak  " +
        "AND user.id_user = belanja_ternak.id_user  " +
        "AND visual.id_ternak = ternak.id_ternak  " +
        "AND belanja_ternak.id_user =" +req.query.id_user+" "+
        "AND visual.tgl_periksa IN (SELECT MAX( tgl_periksa ) FROM visual GROUP BY visual.id_ternak) ORDER BY tanggal_belanja DESC", function (err, rows, fields) {
        if (rows.length !=0){
            data["LaporanBelanja"] = rows;
            res.json(data);
        } else{
            data["Hewan"] = 'Tidak ada hewan yang dicari';
            res.json(data);
        }
    })
});

//get id dan status ternak
app.get('/getStatusPasar',function (req,res) {
    var data = {
    };
    connection.query("SELECT id_ternak, status_pasar from ternak where id_ternak = "+req.query.id_ternak, function (err, rows, fields) {
        if (rows.length !=0){
            data["UpdateStatusPasar"] = rows;
            res.json(data);
        } else{
            data["Hewan"] = 'Tidak Ada data Warga...';
            res.json(data);
        }
    })
});


// update status pasar
app.post('/updateStatusPasar',function (req,res){
    var idTernak = req.body.id_ternak;
    var statusPasar = req.body.status_pasar;
    var data ={
        "error":1,
        "Informasi":""
    };
    if(!!statusPasar && !!idTernak){
        console.log("asdasdas")
        var x = connection.query("UPDATE ternak SET status_pasar=? WHERE id_ternak=?",[statusPasar,idTernak],function(err,rows,fields){
            console.log(x);
            if(!!err){
                data["Informasi"] = "kesalahan pengubahan data";
            }else{
                data["error"] = 0;
                data["UpdateStatusPasar"] = "Data surat pengantar telah berhasil diubah";
            }
            res.json(data);
        });
    }else{
        data["Informasi"] = "inputkan data berdasarkan (i.e : )";
        res.json(data);
    }
});

// update status pasar & status
app.post('/updateTransaksi',function (req,res){
    var idTernak = req.body.id_ternak;
    var statusPasar = req.body.status_pasar;
    var status = req.body.status;
    var data ={
        "error":1,
        "Informasi":""
    };
    if(!!statusPasar && !!idTernak){
        console.log("asdasdas")
        var x = connection.query("UPDATE ternak SET status_pasar=?, status=? WHERE id_ternak=?",[statusPasar, status, idTernak],function(err,rows,fields){
            console.log(x);
            if(!!err){
                data["Informasi"] = "kesalahan pengubahan data";
            }else{
                data["error"] = 0;
                data["UpdateStatusPasar"] = "Data surat pengantar telah berhasil diubah";
            }
            res.json(data);
        });
    }else{
        data["Informasi"] = "inputkan data berdasarkan (i.e : )";
        res.json(data);
    }
});

// Add data user
app.post('/addUser',function (req,res){
    var idUser = req.body.id_user;
    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.email;
    var noTelp = req.body.no_telepon;
    var namaDepan= req.body.nama_depan;
    var namaBelakang = req.body.nama_belakang;
    var data ={
        "error":1,
        "Add Akun":""
    };
    if(!!idUser && !!username && !!password && !!email && !!noTelp && !!namaDepan && !!namaBelakang){
        connection.query("INSERT INTO tb_user VALUES(?,?,?,?,?,?,?)",[idUser,username,password,email,noTelp,namaDepan,namaBelakang],function(err,rows,fields){
            if(!!err){
                data["Informasi"] = "kesalahan penambahan akun";
            }else{
                data["error"] = 0;
                data["Informasi"] = "Data akun telah berhasil ditambahkan";
            }
            res.json(data);
        });
    }else{
        data["Informasi"] = "inputkan data berdasarkan (i.e : )";
        res.json(data);
    }
});

// Mengambil data penjualan dan alumni
app.get('/getPenjualanByUser',function (req,res) {
    var data = {
    };
        connection.query("SELECT user.id_user, penjualan.id_penjualan, DATE_FORMAT(  tanggal_jual ,  '%d-%m-%Y' ) AS tanggal_jual , penjualan.harga_jual," +
            " penjualan.margin, penjualan.untung, user.nama_belakang, ternak.id_ternak, jenis_hewan.nama_jenis_hewan as jenis_hewan, " +
            "spesies_hewan.nama_spesies_hewan as spesies, visual.foto_1, visual.foto_2, visual.foto_3, visual.url_video " +
            "FROM visual, ternak, user, spesies_hewan, jenis_hewan, penjualan " +
            "WHERE visual.id_ternak = ternak.id_ternak " +
            "AND user.id_user = ternak.id_user " +
            "AND ternak.id_ternak = penjualan.id_ternak " +
            "AND ternak.id_spesies_hewan = spesies_hewan.id_spesies_hewan " +
            "AND spesies_hewan.id_jenis_hewan = jenis_hewan.id_jenis_hewan " +
            "AND ternak.id_user =" +req.query.id_user+" "+
            "AND visual.tgl_periksa IN ( SELECT MAX( tgl_periksa ) FROM  visual GROUP BY visual.id_ternak)", function (err, rows, fields) {
        if (rows.length !=0){
            data["Penjualan"] = rows;
            res.json(data);
        } else{
            data["Hewan"] = 'Tidak ada hewan yang dicari';
            res.json(data);
        }
    })
});

// Mengambil data perawatan
app.get('/getPerawatanByUser',function (req,res) {
    var data = {
    };
    connection.query("SELECT user.id_user, perawatan.id_perawatan, perawatan.keterangan , perawatan.total_harga, user.nama_belakang, ternak.id_ternak, jenis_hewan.nama_jenis_hewan, spesies_hewan.nama_spesies_hewan, visual.foto_1, visual.foto_2, visual.foto_3, visual.url_video " +
        "FROM visual, ternak, user, spesies_hewan, jenis_hewan, perawatan " +
        "WHERE visual.id_ternak = ternak.id_ternak " +
        "AND user.id_user = ternak.id_user " +
        "AND ternak.id_ternak = perawatan.id_ternak " +
        "AND ternak.id_spesies_hewan = spesies_hewan.id_spesies_hewan " +
        "AND jenis_hewan.id_jenis_hewan = spesies_hewan.id_jenis_hewan " +
        "AND ternak.id_user = " +req.query.id_user+" "+
        "AND visual.tgl_periksa IN ( SELECT MAX( tgl_periksa ) FROM  visual GROUP BY visual.id_ternak)", function (err, rows, fields) {
        if (rows.length !=0){
            data["Perawatan"] = rows;
            res.json(data);
        } else{
            data["Hewan"] = 'Tidak ada hewan yang dicari';
            res.json(data);
        }
    })
});




//getLokasi
app.get('/getLokasi',function (req,res) {
    var data = {
    };
    connection.query("select name as nama_daerah from kabupaten_kota", function (err, rows, fields) {
        if (rows.length !=0){
            data["Lokasi"] = rows;
            res.json(data);
        } else{
            data["Hewan"] = 'Tidak ada hewan yang dicari';
            res.json(data);
        }
    })
});

//delete belanja
app.post('/deleteBelanja',function (req,res){
    var idBelanja = req.body.id_belanja;
    var data ={
        "error":1,
        "Informasi":""
    };
    if(!!idBelanja){
        connection.query("DELETE from belanja_ternak WHERE id_belanja=?",[idBelanja],function(err,rows,fields){
            if(!!err){
                data["Informasi"] = "Kesalahan penghapusan data";
            }else{
                data["error"] = 0;
                data["Informasi"] = "Data informasi telah berhasil dihapus";
            }
            res.json(data);
        });
    }else{
        data["Informasi"] = "inputkan data berdasarkan (i.e : )";
        res.json(data);
    }
});

// Mengambil data asisten berdasarkan pengguna
app.get('/getAsistenByUser',function (req,res) {
    var data = {
    };
    connection.query("SELECT ternak.id_ternak, spesies_hewan.nama_spesies_hewan, jenis_hewan.nama_jenis_hewan, " +
        "visual.foto_1, visual.foto_2, visual.foto_3, visual.url_video, visual.bobot, visual.tinggi, visual.panjang " +
        "FROM ternak, spesies_hewan, jenis_hewan, visual,  asisten " +
        "WHERE visual.id_ternak = ternak.id_ternak " +
        "AND ternak.id_spesies_hewan = spesies_hewan.id_spesies_hewan " +
        "AND spesies_hewan.id_jenis_hewan = jenis_hewan.id_jenis_hewan " +
        "AND asisten.id_asisten = visual.id_asisten " +
        "AND visual.id_asisten =  "+req.query.id_asisten+" " +
        "AND visual.tgl_periksa IN (SELECT MAX( tgl_periksa ) FROM visual GROUP BY visual.id_ternak)", function (err, rows, fields) {
        if (rows.length !=0){
            data["TernakAsisten"] = rows;
            res.json(data);
        } else{
            data["Hewan"] = 'Tidak ada asisten yang dicari';
            res.json(data);
        }
    })
});

// Mengambil data peternak berdasarkan pengguna
app.get('/getPeternakByUser',function (req,res) {
    var data = {
    };
    connection.query("SELECT ternak.id_ternak, spesies_hewan.nama_spesies_hewan, jenis_hewan.nama_jenis_hewan, " +
        "visual.foto_1, visual.foto_2, visual.foto_3, visual.url_video, visual.bobot, visual.tinggi, " +
        "visual.panjang, peternak.id_peternak, peternak.nama_depan, peternak.nama_belakang, peternak.url_foto " +
        "FROM ternak, spesies_hewan, jenis_hewan, visual, peternak " +
        "WHERE visual.id_ternak = ternak.id_ternak " +
        "AND ternak.id_spesies_hewan = spesies_hewan.id_spesies_hewan " +
        "AND spesies_hewan.id_jenis_hewan = jenis_hewan.id_jenis_hewan " +
        "AND peternak.id_peternak = ternak.id_peternak " +
        "AND ternak.id_peternak = "+req.query.id_peternak+" "+
        "AND visual.tgl_periksa IN (SELECT MAX( tgl_periksa ) FROM visual GROUP BY visual.id_ternak)", function (err, rows, fields) {
        if (rows.length !=0){
            data["TernakPeternak"] = rows;
            res.json(data);
        } else{
            data["Hewan"] = 'Tidak ada peternak yang dicari';
            res.json(data);
        }
    })
});

// Mengambil data kandang berdasarkan pengguna
app.get('/getKandangByUser',function (req,res) {
    var data = {
    };
    connection.query("SELECT ternak.id_ternak, spesies_hewan.nama_spesies_hewan, jenis_hewan.nama_jenis_hewan, " +
        "visual.foto_1, visual.foto_2, visual.foto_3, visual.url_video, visual.bobot, visual.tinggi, visual.panjang " +
        "FROM ternak, spesies_hewan, jenis_hewan, visual,  kandang " +
        "WHERE visual.id_ternak = ternak.id_ternak " +
        "AND ternak.id_spesies_hewan = spesies_hewan.id_spesies_hewan " +
        "AND spesies_hewan.id_jenis_hewan = jenis_hewan.id_jenis_hewan " +
        "AND kandang.id_kandang = ternak.id_kandang " +
        "AND ternak.id_kandang =  " +req.query.id_kandang+" "+
        "AND visual.tgl_periksa IN (SELECT MAX( tgl_periksa ) FROM visual GROUP BY visual.id_ternak)", function (err, rows, fields) {
        if (rows.length !=0){
            data["TernakKandang"] = rows;
            res.json(data);
        } else{
            data["Hewan"] = 'Tidak ada peternak yang dicari';
            res.json(data);
        }
    })
});

// Mengambil data peternak berdasarkan pengguna
app.get('/getPeternak',function (req,res) {
    var data = {
    };
    connection.query("select peternak.id_peternak as peternak, peternak.nama_depan, peternak.nama_belakang, peternak.url_foto, " +
        "peternak.kapasitas_ternak, kabupaten_kota.name as lokasi, peternak.keterangan, (SELECT COUNT(*) FROM ternak, peternak WHERE peternak.id_peternak = ternak.id_peternak " +
        "AND ternak.id_peternak = peternak ) as jumlah_terisi " +
        "FROM peternak, ternak, kabupaten_kota, kecamatan WHERE ternak.id_peternak = peternak.id_peternak " +
        "AND kabupaten_kota.id = kecamatan.regency_id " +
        "AND kecamatan.id = peternak.id_kecamatan " +
        "AND ternak.id_user = "+req.query.id_user+" GROUP BY peternak.id_peternak", function (err, rows, fields) {
        if (rows.length !=0){
            data["Peternak"] = rows;
            res.json(data);
        } else{
            data["Peternak"] = 'Tidak ada peternak yang dicari';
            res.json(data);
        }
    })
});

// Mengambil data kandang berdasarkan pengguna
app.get('/getKandang',function (req,res) {
    var data = {
    };
    connection.query("select kandang.id_kandang as kandang, kandang.nama_kandang, kandang.kapasitas, kandang.pemilik_kandang, kandang.alamat, " +
        "kabupaten_kota.name, (SELECT COUNT(*) FROM ternak, kandang WHERE kandang.id_kandang = ternak.id_kandang " +
        "AND kandang.id_kandang = kandang ) as jumlah_terisi " +
        "from kandang, ternak, kabupaten_kota, kecamatan  where ternak.id_kandang = kandang.id_kandang " +
        "and kandang.id_kecamatan = kecamatan.id and kecamatan.regency_id = kabupaten_kota.id " +
        "and ternak.id_user = "+req.query.id_user+" group by kandang.id_kandang", function (err, rows, fields) {
        if (rows.length !=0){
            data["Kandang"] = rows;
            res.json(data);
        } else{
            data["Peternak"] = 'Tidak ada kandang yang dicari';
            res.json(data);
        }
    })
});

// Mengambil data asisteb berdasarkan pengguna
app.get('/getAsisten',function (req,res) {
    var data = {
    };
    connection.query("select asisten.id_asisten as asisten, asisten.nama_depan, asisten.nama_belakang, asisten.foto, asisten.video, asisten. alamat, kabupaten_kota.name, (SELECT COUNT(*) FROM ternak, asisten_ternak WHERE ternak.id_ternak = asisten_ternak.id_ternak AND asisten_ternak.id_asisten = asisten ) as jumlah_merawat " +
        "from ternak, asisten, asisten_ternak, kecamatan, kabupaten_kota " +
        "where asisten.id_asisten = asisten_ternak.id_asisten " +
        "and ternak.id_ternak = asisten_ternak.id_ternak and asisten.id_kecamatan = kecamatan.id and kecamatan.regency_id = kabupaten_kota.id " +
        "and ternak.id_user = "+req.query.id_user+ " "+
        "group by asisten.id_asisten", function (err, rows, fields) {
        if (rows.length !=0){
            data["Asisten"] = rows;
            res.json(data);
        } else{
            data["Peternak"] = 'Tidak ada kandang yang dicari';
            res.json(data);
        }
    })
});


























app.post('/dataWarga',function (req,res){
    var noIdentitas = req.body.no_identitas;
    var Nama = req.body.nama;
    var tempatLahir = req.body.tempat_lahir;
    var tanggalLahir = req.body.tanggal_lahir;
    var Alamat = req.body.alamat;
    var rtRw= req.body.rt/rw;
    var kelDesa = req.body.kel/desa;
    var Kecamatan = req.body.kecamatan;
    var Agama = req.body.agama;
    var statusPerkawinan= req.body.status_perkawinan;
    var statusKependudukan= req.body.status_kependudukan;
    var data ={
        "error":1,
        "Informasi":""
    };
    if(!!noIdentitas && !!Nama && !!tempatLahir && !!tanggalLahir && !!Alamat && !!rtRw && !!kelDesa && !!Kecamatan && !!Agama && !!statusPerkawinan && !!statusKependudukan){
        connection.query("INSERT INTO tb_penduduk VALUES(?,?,?,?,?,?,?,?,?,?,?)",[noIdentitas,Nama,tempatLahir,tanggalLahir,Alamat,rtRw,kelDesa,Kecamatan,Agama,statusPerkawinan,statusKependudukan],function(err,rows,fields){
            if(!!err){
                data["Informasi"] = "kesalahan penambahan data";
            }else{
                data["error"] = 0;
                data["Informasi"] = "Data kependudukan telah berhasil ditambahkan";
            }
            res.json(data);
        });
    }else{
        data["Informasi"] = "inputkan data berdasarkan (i.e : )";
        res.json(data);
    }
});



// Add data warga
app.post('/dataWarga',function (req,res){
    var noIdentitas = req.body.no_identitas;
    var Nama = req.body.nama;
    var tempatLahir = req.body.tempat_lahir;
    var tanggalLahir = req.body.tanggal_lahir;
    var Alamat = req.body.alamat;
    var rtRw= req.body.rt/rw;
    var kelDesa = req.body.kel/desa;
    var Kecamatan = req.body.kecamatan;
    var Agama = req.body.agama;
    var statusPerkawinan= req.body.status_perkawinan;
    var statusKependudukan= req.body.status_kependudukan;
    var data ={
        "error":1,
        "Informasi":""
    };
    if(!!noIdentitas && !!Nama && !!tempatLahir && !!tanggalLahir && !!Alamat && !!rtRw && !!kelDesa && !!Kecamatan && !!Agama && !!statusPerkawinan && !!statusKependudukan){
        connection.query("INSERT INTO tb_penduduk VALUES(?,?,?,?,?,?,?,?,?,?,?)",[noIdentitas,Nama,tempatLahir,tanggalLahir,Alamat,rtRw,kelDesa,Kecamatan,Agama,statusPerkawinan,statusKependudukan],function(err,rows,fields){
            if(!!err){
                data["Informasi"] = "kesalahan penambahan data";
            }else{
                data["error"] = 0;
                data["Informasi"] = "Data kependudukan telah berhasil ditambahkan";
            }
            res.json(data);
        });
    }else{
        data["Informasi"] = "inputkan data berdasarkan (i.e : )";
        res.json(data);
    }
});

// Edit data warga
app.put('/dataWarga',function (req,res){
    var noIdentitas = req.body.no_identitas;
    var Nama = req.body.nama;
    var tempatLahir = req.body.tempat_lahir;
    var tanggalLahir = req.body.tanggal_lahir;
    var Alamat = req.body.alamat;
    var rtRw= req.body.rt/rw;
    var kelDesa = req.body.kel/desa;
    var Kecamatan = req.body.kecamatan;
    var Agama = req.body.agama;
    var statusPerkawinan= req.body.status_perkawinan;
    var statusKependudukan= req.body.status_kependudukan;
    var data ={
        "error":1,
        "Informasi":""
    };
    if(!!noIdentitas && !!Nama && !!tempatLahir && !!tanggalLahir && !!Alamat && !!rtRw && !!kelDesa && !!Kecamatan && !!Agama && !!statusPerkawinan && !!statusKependudukan){
            connection.query("UPDATE tb_penduduk SET no_identitas=?, nama=?, konten=?, tempat_lahir=?, tanggal_lahir=?, alamat=?, rt/rw=?, kel/desa=?, kecamatan=?, agama=?, status_perkawinan=?, status_kependudukan=?  WHERE no_identitas=?",[noIdentitas,Nama,tempatLahir,tanggalLahir,Alamat,rtRw,kelDesa,Kecamatan,Agama,statusPerkawinan,statusKependudukan,noIdentitas],function(err,rows,fields){
            if(!!err){
                data["Informasi"] = "kesalahan penambahan data";
            }else{
                data["error"] = 0;
                data["Informasi"] = "Data kependudukan telah berhasil diubah";
            }
            res.json(data);
        });
    }else{
        data["Informasi"] = "inputkan data berdasarkan (i.e : judul,tanggal_publikasi,kontent,sumber";
        res.json(data);
    }
});

// Hapus data warga
app.delete('/hapusDataWarga',function (req,res){
    var noIdentitas = req.body.no_identitas;
    var data ={
        "error":1,
        "Informasi":""
    };
    if(!!noIdentitas){
        connection.query("DELETE from tb_penduduk WHERE no_identitas=?",[noIdentitas],function(err,rows,fields){
            if(!!err){
                data["Informasi"] = "Kesalahan penghapusan data";
            }else{
                data["error"] = 0;
                data["Informasi"] = "Data informasi telah berhasil dihapus";
            }
            res.json(data);
        });
    }else{
        data["Informasi"] = "inputkan data berdasarkan (i.e : )";
        res.json(data);
    }
});


//BAGIAN INFORMASI

app.get('/informasiID',function (req,res) {
    var data = {
        "error":1,
        "informasi":""
    };
    connection.query("SELECT * from tb_pengumuman where kode_penugmuman ="+ req.query.kode_penugmuman, function (err, rows, fields) {
        if (rows.length !=0){
            data["error"] = 0;
            data["Pengumuman"] = rows;
            res.json(data);
        } else{
            data["Pengumuman"] = 'Tidak Ada Pengumuman...';
            res.json(data);
        }
    })
});

// Mengambil data informasi
app.get('/informasi',function (req,res) {
    var data = {
        "error":1,
        "informasi":""
    };
    connection.query("SELECT `kode_penugmuman`, `judul`, DATE_FORMAT(`tanggal_publikasi`, '%d-%m-%Y'), `konten`, `sumber`,`gambar` FROM `tb_pengumuman` ORDER BY `tb_pengumuman`.`kode_penugmuman` DESC", function (err, rows, fields) {
        if (rows.length !=0){
            data["error"] = 0;
            data["Pengumuman"] = rows;
            res.json(data);
        } else{
            data["Pengumuman"] = 'Tidak Ada Pengumuman...';
            res.json(data);
        }
    })
});



// Add data informasi
app.post('/addInformasi',function (req,res){
    var kodePengumuman = req.body.kode_penugmuman;
    var Judul = req.body.judul;
    var tanggalPublikasi = req.body.tanggal_publikasi;
    var Konten = req.body.konten;
    var Sumber = req.body.sumber;
    var Gambar = req.body.gambar;
    var data ={
        "error":1,
        "Informasi":""
    };
    if(!!kodePengumuman && !!Judul && !!tanggalPublikasi && !!Konten && !!Sumber && !!Gambar){
        connection.query("INSERT INTO tb_pengumuman VALUES(?,?,?,?,?,?)",[kodePengumuman,Judul,tanggalPublikasi,Konten,Sumber, Gambar],function(err,rows,fields){
            if(!!err){
                data["Informasi"] = "kesalahan penambahan data";
            }else{
                data["error"] = 0;
                data["Informasi"] = "Data informasi telah berhasil ditambahkan";
            }
            res.json(data);
        });
    }else{
        data["Informasi"] = "inputkan data berdasarkan (i.e : judul,tanggal_publikasi,kontent,sumber";
        res.json(data);
    }
});

// Edit data informasi
app.put('/editInformasi',function (req,res){
    var kodePengumuman = req.body.kode_penugmuman;
    var Judul = req.body.judul;
    var tanggalPublikasi = req.body.tanggal_publikasi;
    var Konten = req.body.konten;
    var Sumber = req.body.sumber;
    var data ={
        "error":1,
        "Informasi":""
    };
    if(!!kodePengumuman && !!Judul && !!tanggalPublikasi && !!Konten && !!Sumber ){
        connection.query("UPDATE tb_pengumuman SET judul=?, tanggal_publikasi=?, konten=?, sumber=? WHERE kode_penugmuman=?",[Judul,tanggalPublikasi,Konten,Sumber,kodePengumuman],function(err,rows,fields){
            if(!!err){
                data["Informasi"] = "kesalahan pengubahan data";
            }else{
                data["error"] = 0;
                data["Informasi"] = "Data informasi telah berhasil diubah";
            }
            res.json(data);
        });
    }else{
        data["Informasi"] = "inputkan data berdasarkan (i.e : judul,tanggal_publikasi,kontent,sumber";
        res.json(data);
    }
});

// Hapus data informasi
app.delete('/deletInformasi',function (req,res){
    var kodePengumuman = req.body.kode_penugmuman;
    var data ={
        "error":1,
        "Informasi":""
    };
    if(!!kodePengumuman){
        connection.query("DELETE from tb_pengumuman WHERE kode_penugmuman=?",[kodePengumuman],function(err,rows,fields){
            if(!!err){
                data["Informasi"] = "kesalahan penghapusan data";
            }else{
                data["error"] = 0;
                data["Informasi"] = "Data informasi telah berhasil dihapus";
            }
            res.json(data);
        });
    }else{
        data["Informasi"] = "inputkan data berdasarkan (i.e : judul,tanggal_publikasi,kontent,sumber";
        res.json(data);
    }
});

//BAGIAN IURAN

// Mengambil data informasi
app.get('/getIuran',function (req,res) {
    var data = {
        "error":1,
        "informasi":"Data Iuran Bulanan"
    };
    connection.query("SELECT * from tb_iuran", function (err, rows, fields) {
        if (rows.length !=0){
            data["error"] = 0;
            data["Iuran"] = rows;
            res.json(data);
        } else{
            data["Iuran"] = 'Tidak Ada Data Iuran';
            res.json(data);
        }
    })
});


//test date format mysql
app.get('/getTestDateFormat',function (req,res) {
    var data = {
        "error":1,
        "informasi":"Data Iuran Bulanan"
    };
    connection.query("SELECT `kode_iuran`, `kode_keluarga`,  DATE_FORMAT(tanggal_bayar, '%d-%m-%Y'), `bulan_iuran` FROM `tb_iuran`", function (err, rows, fields) {
        if (rows.length !=0){
            data["error"] = 0;
            data["Iuran"] = rows;
            res.json(data);
        } else{
            data["Iuran"] = 'Tidak Ada Data Iuran';
            res.json(data);
        }
    })
});


// Mengambil data informasi by kode keluarga
app.get('/getIuranByKodeKeluarga',function (req,res) {
    var data = {
    };
    connection.query("SELECT `kode_iuran`, `kode_keluarga`,  DATE_FORMAT(tanggal_bayar, '%d-%m-%Y'), `bulan_iuran` from tb_iuran where kode_keluarga ="+ req.query.kode_keluarga+" order by kode_iuran desc", function (err, rows, fields) {
        if (rows.length !=0){
            data["Iuran"] = rows;
            res.json(data);
        } else{
            data["Iuran"] = 'Tidak Ada Data Iuran';
            res.json(data);
        }
    })
});

// Add data iuran
app.post('/insertIuran',function (req,res){
    var kodeIuran = req.body.kode_iuran;
    var kodeKeluarga = req.body.kode_keluarga;
    var tanggalBayar = req.body.tanggal_bayar;
    var bulanIuran = req.body.bulan_iuran;
    var data ={
        "error":1,
        "Informasi":"Tambah Data Iuran"
    };
    if(!!kodeIuran && !!kodeKeluarga && !!tanggalBayar && !!bulanIuran ){
        connection.query("INSERT INTO tb_iuran VALUES(?,?,?,?)",[kodeIuran,kodeKeluarga,tanggalBayar,bulanIuran],function(err,rows,fields){
            if(!!err){
                data["Informasi"] = "kesalahan penambahan data";
            }else{
                data["error"] = 0;
                data["Informasi"] = "Data iuran telah berhasil ditambahkan";
            }
            res.json(data);
        });
    }else{
        data["Informasi"] = "inputkan data berdasarkan (i.e : )";
        res.json(data);
    }
});

// Edit data iuran
app.put('/updateIuran',function (req,res){
    var kodeIuran = req.body.kode_iuran;
    var kodeKeluarga = req.body.kode_keluarga;
    var tanggalBayar = req.body.tanggal_bayar;
    var bulanIuran = req.body.bulan_iuran;
    var data ={
        "error":1,
        "Informasi":""
    };
    if(!!kodeIuran && !!kodeKeluarga && !!tanggalBayar && !!bulanIuran ){
        connection.query("UPDATE tb_iuran SET kode_keluarga=?, tanggal_bayar=?, bulan_iuran=? WHERE kode_iuran=?",[kodeKeluarga,tanggalBayar,bulanIuran,kodeIuran],function(err,rows,fields){
            if(!!err){
                data["Informasi"] = "kesalahan pengubahan data";
            }else{
                data["error"] = 0;
                data["Informasi"] = "Data iuran telah berhasil diubah";
            }
            res.json(data);
        });
    }else{
        data["Informasi"] = "inputkan data berdasarkan (i.e : )";
        res.json(data);
    }
});

// Hapus data iuran
app.delete('/deleteIuran',function (req,res){
    var kodeIuran = req.body.kode_iuran;
    var data ={
        "error":1,
        "Informasi":""
    };
    if(!!kodeIuran){
        connection.query("DELETE from tb_iuran WHERE kode_iuran=?",[kodeIuran],function(err,rows,fields){
            if(!!err){
                data["Informasi"] = "kesalahan penghapusan data";
            }else{
                data["error"] = 0;
                data["Informasi"] = "Data iuran telah berhasil dihapus";
            }
            res.json(data);
        });
    }else{
        data["Informasi"] = "inputkan data berdasarkan (i.e : )";
        res.json(data);
    }
});

//BAGIAN SURAT PENGANTAR

//get data anggota keluarga pengajuan surat
app.get('/getDataAnggota',function (req,res) {
    var a = 1
    var data = {
        "error":1,
        "informasi":"Data Surat Pengantar"
    };
    connection.query("SELECT tb_anggota_keluarga.kode_keluarga, tb_anggota_keluarga.no_identitas, tb_penduduk.nama, tb_penduduk.alamat, tb_penduduk.alamat, tb_penduduk.rtrw, tb_penduduk.kecamatan, tb_penduduk.agama, tb_penduduk.foto from tb_anggota_keluarga INNER JOIN tb_penduduk WHERE tb_anggota_keluarga.no_identitas = tb_penduduk.no_identitas AND tb_anggota_keluarga.kode_keluarga="+req.query.kode_keluarga, function (err, rows, fields) {
        if (rows.length !=0){

            data["error"] = 0;
            data["DataAnggota"] = rows;
            console.log(data);
            res.json(data);

        } else{



            data["DataAnggota"] = 'Tidak Ada Data Surat Pengantar';
            res.json(data);
        }
    })
});


// Mengambil data surat pengantar
app.get('/getSuratPengantar',function (req,res) {
    var data = {
    };
        connection.query("SELECT * from tb_surat_pengantar where no_surat="+req.query.no_surat, function (err, rows, fields) {
            if (rows.length !=0){
                data["SuratPengantar"] = rows;
                res.json(data);
            } else{
                data["SuratPengantar"] = 'Tidak Ada Data Surat Pengantar';
                res.json(data);
            }
        })
});

app.get('/getSuratPengantarByKodeKeluarga',function (req,res) {
    var date = req.body.tanggal_pengajuan;
    var data = {
    };
   connection.query("SELECT DATE_FORMAT( tb_surat_pengantar.tanggal_pengajuan,  '%d-%m-%Y' ) as tanggal_pengajuan, DATE_FORMAT( tb_surat_pengantar.tanggal_selesai,  '%d-%m-%Y' ) as tanggal_selesai, tb_surat_pengantar.jenis_surat, tb_surat_pengantar.status_pembuatan, tb_penduduk.nama FROM tb_surat_pengantar INNER JOIN tb_penduduk where tb_penduduk.no_identitas = tb_surat_pengantar.no_identitas and tb_surat_pengantar.kode_keluarga="+req.query.kode_keluarga, function (err, rows, fields) {
        if (rows.length !=0){

            data["SuratPengantar"] = rows;
            console.log(data);
            res.json(data);

        } else{
            data["SuratPengantar"] = 'Tidak Ada Data Surat Pengantar';
            res.json(data);
        }
    })
});

// Add data surat pengantar
app.post('/insertSuratPengantar',function (req,res){
    var noSurat = req.body.no_surat;
    var kodeKeluarga = req.body.kode_keluarga;
    var noIdentitas = req.body.no_identitas;
    var jenisSurat = req.body.jenis_surat;
    var tanggalPengajuan = req.body.tanggal_pengajuan;
    var tanggalSelesai = req.body.tanggal_selesai;
    var statusPembuatan = req.body.status_pembuatan;
    var data ={
    };
    if(!!noSurat && !!kodeKeluarga && !!noIdentitas && !!jenisSurat && !!tanggalPengajuan && !!tanggalSelesai && !!statusPembuatan){
        connection.query("INSERT INTO tb_surat_pengantar VALUES(?,?,?,?,?,?,?)",[noSurat,kodeKeluarga,noIdentitas,jenisSurat,tanggalPengajuan,tanggalSelesai,statusPembuatan],function(err,rows,fields){
            if(!!err){
                data["Informasi"] = "kesalahan penambahan data";
            }else{
                data["Informasi"] = "Data surat pengantar telah berhasil ditambahkan";
            }
            res.json(data);
        });
    }else{
        data["Informasi"] = "inputkan data berdasarkan (i.e : )";
        console.log(data)
        res.json(data);
    }
});

// Edit data surat pengantar
app.put('/updateSuratPengantar',function (req,res){
    var noSurat = req.body.no_surat;
    var kodeKeluarga = req.body.kode_keluarga;
    var noIdentitas = req.body.no_identitas;
    var jenisSurat = req.body.jenis_surat;
    var tanggalPengajuan = req.body.tanggal_pengajuan;
    var tanggalSelesai = req.body.tanggal_selesai;
    var statusPembuatan = req.body.status_pembuatan;
    var data ={
        "error":1,
        "Informasi":""
    };
    if(!!noSurat && !!kodeKeluarga && !!noIdentitas && !!jenisSurat && !!tanggalPengajuan && !!tanggalSelesai && !!statusPembuatan){
        var x = connection.query("UPDATE tb_surat_pengantar SET kode_keluarga=?, no_identitas=?, jenis_surat=?, tanggal_pengajuan=?, tanggal_selesai=?, status_pembuatan=? WHERE no_surat=?",[kodeKeluarga,noIdentitas,jenisSurat,tanggalPengajuan,tanggalSelesai,statusPembuatan,noSurat],function(err,rows,fields){
            console.log(x);
            if(!!err){
                data["Informasi"] = "kesalahan pengubahan data";
            }else{
                data["error"] = 0;
                data["Informasi"] = "Data surat pengantar telah berhasil diubah";
            }
            res.json(data);
        });
    }else{
        data["Informasi"] = "inputkan data berdasarkan (i.e : )";
        res.json(data);
    }
});

// Hapus data surat pengantar
app.delete('/deleteSuratPengantar',function (req,res){
    var noSurat = req.body.no_surat;
    var data ={
        "error":1,
        "Informasi":""
    };
    if(!!noSurat){
        connection.query("DELETE from tb_surat_pengantar WHERE no_surat=?",[noSurat],function(err,rows,fields){
            if(!!err){
                data["Informasi"] = "kesalahan penghapusan data";
            }else{
                data["error"] = 0;
                data["Informasi"] = "Data surat pengantar telah berhasil dihapus";
            }
            res.json(data);
        });
    }else{
        data["Informasi"] = "inputkan data berdasarkan (i.e : )";
        res.json(data);
    }
});

//get profil
app.get('/getProfil',function (req,res) {
    var date = req.body.tanggal_pengajuan;
    var data = {
        "error":1,
        "informasi":"Data Profil"
    };
    connection.query("SELECT tb_penduduk.nama, tb_penduduk.no_identitas, tb_penduduk.alamat, tb_penduduk.rtrw, tb_penduduk.kecamatan, tb_penduduk.agama FROM tb_penduduk INNER JOIN tb_akun WHERE tb_akun.no_identitas_kepala_keluarga = tb_penduduk.no_identitas AND tb_akun.no_identitas_kepala_keluarga="+req.query.no_identitas_kepala_keluarga, function (err, rows, fields) {
        if (rows.length !=0){

            data["error"] = 0;
            data["DataProfil"] = rows;
            console.log(data);
            res.json(data);

        } else{
            data["SuratPengantar"] = 'Tidak Ada Data Surat Pengantar';
            res.json(data);
        }
    })
});

// get data anggota baru
app.get('/getDataAnggotaBaru',function (req,res) {
    var date = req.body.tanggal_pengajuan;
    var data = {
    };
    connection.query("SELECT `no_identitas`, `nama`, `tempat_lahir`, DATE_FORMAT(tanggal_lahir, '%d-%m-%Y'), `alamat`, `rtrw`, `kel/desa`, `kecamatan`, `agama`,`status_perkawinan`,`status_kependudukan`, `foto` FROM tb_penduduk WHERE no_identitas ="+req.query.no_identitas, function (err, rows, fields) {
        if (rows.length !=0){

            data["DataAnggotaBaru"] = rows;
            console.log(data);
            res.json(data);

        } else{
            data["SuratPengantar"] = 'Tidak Ada Data Surat Pengantar';
            res.json(data);
        }
    })
});

app.post('/insertAkun',function (req,res){

    var kodeKeluarga = req.body.kode_keluarga;
    var noIdentitas = req.body.no_identitas;
    var username = req.body.username;
    var password = req.body.password;
    var data ={
    };
    if(!!kodeKeluarga && !!noIdentitas && !!username && !!password){
        connection.query("INSERT INTO tb_akun VALUES(?,?,?,?)",[kodeKeluarga,noIdentitas,username,password],function(err,rows,fields){
            if(!!err){
                data["Informasi"] = "kesalahan penambahan data";
            }else{
                data["Anggota Keluarga"] = "Data Keluarga berhasil ditambahkan";
            }
            res.json(data);
        });
    }else{
        data["Informasi"] = "inputkan data berdasarkan (i.e : )";
        console.log(data)
        res.json(data);
    }
});

app.put('/updateStatusAkun',function (req,res){
    var noIdentias = req.body.no_identitas;
    var statusAkun = req.body.status_akun;
    var data ={
        "error":1,
        "Informasi":""
    };
    if(!!statusAkun){
        console.log("asdasdas")
        var x = connection.query("UPDATE tb_penduduk SET status_akun=? WHERE no_identitas=?",[statusAkun,noIdentias],function(err,rows,fields){
            console.log(x);
            if(!!err){
                data["Informasi"] = "kesalahan pengubahan data";
            }else{
                data["error"] = 0;
                data["Informasi"] = "Data surat pengantar telah berhasil diubah";
            }
            res.json(data);
        });
    }else{
        data["Informasi"] = "inputkan data berdasarkan (i.e : )";
        res.json(data);
    }
});

app.post('/insertAnggotaKeluarga',function (req,res){

    var kodeKeluarga = req.body.kode_keluarga;
    var noIdentitas = req.body.no_identitas;
    var data ={
    };
    if(!!kodeKeluarga && !!noIdentitas){
        connection.query("INSERT INTO tb_anggota_keluarga VALUES(?,?)",[kodeKeluarga,noIdentitas],function(err,rows,fields){
            if(!!err){
                data["Informasi"] = "kesalahan penambahan data";
            }else{
                data["Anggota Keluarga"] = "Data Keluarga berhasil ditambahkan";
            }
            res.json(data);
        });
    }else{
        data["Informasi"] = "inputkan data berdasarkan (i.e : )";
        console.log(data)
        res.json(data);
    }
});

app.get('/getAnggota',function (req,res) {
    var data = {
    };
    connection.query("SELECT * from tb_anggota_keluarga", function (err, rows, fields) {
        if (rows.length !=0){
            data["Anggota Keluarga"] = rows;
            res.json(data);
        } else{
            data["Data Warga"] = 'Tidak Ada data Warga...';
            res.json(data);
        }
    })
});

// Mengambil data akun
app.get('/getAkun',function (req,res) {
    var data = {
    };
    connection.query("SELECT * from tb_akun", function (err, rows, fields) {
        if (rows.length !=0){
            data["Akun"] = rows;
            res.json(data);
        } else{
            data["SuratPengantar"] = 'Tidak Ada Data Surat Pengantar';
            res.json(data);
        }
    })
});

http.listen(5500, '0.0.0.0',function(){
    console.log("Connected & Listen to port 5500");
    console.log(connection);
    app.use('/image', express.static(path.join(__dirname, 'image')));
});