-- PostgreSQL 사용
DROP TABLE sizes, likes;
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
    description VARCHAR(10000) DEFAULT '',
    PRIMARY KEY(id)
);

CREATE TABLE sizes(
    id INTEGER,
    size VARCHAR(7),
    FOREIGN KEY (id) REFERENCES products(id) ON DELETE CASCADE,
    PRIMARY KEY(id, size)
);

CREATE TABLE likes(
    product_id INTEGER,
    user_id VARCHAR(20),
    likes INTEGER DEFAULT 0,
    primary key(product_id, user_id),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
