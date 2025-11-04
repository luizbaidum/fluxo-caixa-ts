<?php

require 'db_config.php';

function cadastrarCategoria() 
{
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
}

function listarCategorias() 
{
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
}

function listarContas()
{
    $query = 'SELECT * FROM `contas_correntes` ORDER BY `idContaCorrente`';

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
}

function cadastrarConta() 
{
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
}

function cadastrarMovimento() 
{
    $query = 'INSERT INTO `movimentos` (`valor`, `dataMov`, `idCategoria`, `idContaCorrente`) VALUES (:valor, :dataMov, :idCategoria, :idContaCorrente)';

    $bd = (new ConfigConnection())->getConnection();
    $stmt = $bd->prepare($query);

    $stmt->bindValue(':valor', $_POST['valor'], PDO::PARAM_INT);
    $stmt->bindValue(':dataMov', $_POST['dataMov'], PDO::PARAM_STR);
    $stmt->bindValue(':idCategoria', $_POST['idCategoria'], PDO::PARAM_INT);
    $stmt->bindValue(':idContaCorrente', $_POST['idContaCorrente'], PDO::PARAM_INT);

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
}

function listarMovMensal(string $mes, string|int $ano) 
{
    $query = 'SELECT `movimentos`.*, `categorias`.`descricao` AS descCat, CONCAT(`contas_correntes`.`nomeBanco`, " - ", `contas_correntes`.`nomeConta`) AS descConta
        FROM `movimentos` 
        INNER JOIN `categorias` ON `movimentos`.`idCategoria` = `categorias`.`idCategoria` 
        INNER JOIN `contas_correntes` ON `movimentos`.`idContaCorrente` = `contas_correntes`.`idContaCorrente`
        WHERE MONTH(`movimentos`.`dataMov`) = :mes AND YEAR(`movimentos`.`dataMov`) = :ano
        ORDER BY  `movimentos`.`dataMov` ASC, `movimentos`.`idContaCorrente` ASC, `movimentos`.`idMovimento` ASC';

    $bd = (new ConfigConnection())->getConnection();
    $stmt = $bd->prepare($query);

    $stmt->bindValue(':mes', $mes, PDO::PARAM_STR);
    $stmt->bindValue(':ano', $ano, PDO::PARAM_STR);

    $stmt->execute();
    $result = $stmt->fetchAll(\PDO::FETCH_ASSOC);

    foreach ($result as $v) {
        $ret[$v['dataMov']][$v['idContaCorrente']][] = $v;
    }

    $stmt = null;
    $bd = null;

    echo json_encode(
        [
            'status' => true,
            'ret'    => $ret ?? []
        ]
    );
}

function listarSaldosIniciais()
{
    $query = 'SELECT IFNULL(SUM(`movimentos`.`valor`), 0) AS saldoInicial, `contas_correntes`.`idContaCorrente` FROM `contas_correntes` LEFT JOIN movimentos ON movimentos.idContaCorrente = contas_correntes.idContaCorrente WHERE `movimentos`.`dataMov` < CURDATE() OR `movimentos`.`dataMov` IS NULL GROUP BY `contas_correntes`.`idContaCorrente` ORDER BY `contas_correntes`.`idContaCorrente` ASC';

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
}

?>