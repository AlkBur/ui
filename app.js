'use strict';

// ����������� express
const express = require('express');
const path = require('path');

// ������� ������ ����������
const app = express();
const router = express.Router();

app.use('/js', express.static(path.join(__dirname, 'public', 'js')));
app.use('/css', express.static(path.join(__dirname, 'public', 'css')));
app.use('/ui', express.static(path.join(__dirname, 'public', 'ui')));
app.use('/fonts', express.static(path.join(__dirname, 'public', 'fonts')));


// ���������� ���������� ��� �������� "/"
router.get('/', function (req, res) {
    //response.send("<h2>������ Express!</h2>");
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// �������� ������������ ����������� �� 3000 �����
//add the router
app.use('/', router);
app.listen(process.env.port || 3000);

console.log('Running at Port 3000');