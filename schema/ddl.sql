-- PostgreSQL 사용
DROP TABLE descriptions, sizes;
DROP TABLE products, users;
-- 혹시 테이블이 이미 있었다면 미리 초기화 하기

CREATE TABLE users(
    id VARCHAR(20),
    password VARCHAR(200) NOT NULL,
    nickname VARCHAR(20) NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE products(
    id SERIAL,
    name VARCHAR(50) NOT NULL,
    brand VARCHAR(200),
    price INTEGER,
    color VARCHAR(30),
    likes INTEGER DEFAULT 0,
    PRIMARY KEY(id)
);

CREATE TABLE sizes(
    id INTEGER,
    size VARCHAR(7),
    FOREIGN KEY (id) REFERENCES products(id) ON DELETE CASCADE,
    PRIMARY KEY(id, size)
);

CREATE TABLE descriptions(
    id INTEGER,
    description VARCHAR(10000),
    primary key(id),
    FOREIGN KEY (id) REFERENCES products(id) ON DELETE CASCADE
);
