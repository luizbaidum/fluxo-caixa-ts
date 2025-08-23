Fluxo de caixa simples para planejar e confirmar movimentos bancários.

O projeto desenvolvido com TS, mas para uso na maioria e mais baratos servidores, o arquivo JS exportado que será a fonte da aplicação e atuará com PHP do lado do servidor.
Para estilização usa-se tailwind.

/==/

Abaixo instruções para criação do banco do dados MYSQL:

CREATE TABLE categorias (
    idCategoria INT AUTO_INCREMENT PRIMARY KEY,
    descricao VARCHAR(255) NOT NULL,
    sinal ENUM('+', '-') NOT NULL COMMENT '+ para entrada, - para saída'
) ENGINE=InnoDB;

CREATE TABLE contas_correntes (
    idContaCorrente INT AUTO_INCREMENT PRIMARY KEY,
    nomeBanco VARCHAR(100) NOT NULL,
    nomeConta VARCHAR(100) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE movimentos (
    idMovimento INT AUTO_INCREMENT PRIMARY KEY,
    valor DECIMAL(10,2) NOT NULL,
    data DATE NOT NULL,
    idCategoria INT NOT NULL,
    idContaCorrente INT NOT NULL,
    FOREIGN KEY (idCategoria) REFERENCES categorias(idCategoria)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    FOREIGN KEY (idContaCorrente) REFERENCES contas_correntes(idContaCorrente)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_movimentos_data ON movimentos(data);
CREATE INDEX idx_movimentos_categoria ON movimentos(idCategoria);
CREATE INDEX idx_movimentos_conta ON movimentos(idContaCorrente);