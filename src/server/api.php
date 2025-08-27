<?php

require 'db_config.php';

function cadastrarCategoria() {
    $query = 'INSERT INTO `categorias` (`descricao`, `sinal`) VALUES (:descricao, :sinal)';

    $bd = (new ConfigConnection())->getConnection();
    $stmt = $bd->prepare($query);

    $stmt->bindValue(':descricao', $_POST['descricao'], PDO::PARAM_STR);
    $stmt->bindValue(':sinal', $_POST['sinal'], PDO::PARAM_STR);

    $bd->beginTransaction();

    $stmt->execute();
    $result = $bd->lastInsertId();

    $bd->commit();
    $stmt = null;
    $bd = null;

    echo json_encode(
        [
            'status' => true,
            'id'     => $result
        ]
    );
    exit;
}

function listarCategorias() {
    $query = 'SELECT * FROM `categorias`';

    $bd = (new ConfigConnection())->getConnection();
    $stmt = $bd->prepare($query);

    $stmt->execute();
    $result = $stmt->fetchAll(\PDO::FETCH_ASSOC);

    $stmt = null;
    $bd = null;

    echo json_encode(
        [
            'status' => true,
            'ret'    => $result
        ]
    );
    exit;
}

function listarContas() {
    $query = 'SELECT * FROM `contas_correntes`';

    $bd = (new ConfigConnection())->getConnection();
    $stmt = $bd->prepare($query);

    $stmt->execute();
    $result = $stmt->fetchAll(\PDO::FETCH_ASSOC);

    $stmt = null;
    $bd = null;

    echo json_encode(
        [
            'status' => true,
            'ret'    => $result
        ]
    );
    exit;
}

function cadastrarConta() {
    $query = 'INSERT INTO `contas_correntes` (`nomeBanco`, `nomeConta`, `saldoInicial`) VALUES (:nomeBanco, :nomeConta, :saldoInicial)';

    $bd = (new ConfigConnection())->getConnection();
    $stmt = $bd->prepare($query);

    $stmt->bindValue(':nomeBanco', $_POST['nomeBanco'], PDO::PARAM_STR);
    $stmt->bindValue(':nomeConta', $_POST['nomeConta'], PDO::PARAM_STR);
    $stmt->bindValue(':saldoInicial', $_POST['saldoInicial'], PDO::PARAM_INT);

    $bd->beginTransaction();

    $stmt->execute();
    $result = $bd->lastInsertId();

    $bd->commit();
    $stmt = null;
    $bd = null;

    echo json_encode(
        [
            'status' => true,
            'id'     => $result
        ]
    );
    exit;
}

?>