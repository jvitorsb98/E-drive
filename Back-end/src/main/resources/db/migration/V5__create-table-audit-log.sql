CREATE SEQUENCE audit_log_seq
START WITH 1
INCREMENT BY 1;

CREATE TABLE audit_log (
    id BIGINT DEFAULT nextval('audit_log_seq') PRIMARY KEY,
    event_name VARCHAR(255) UNIQUE NOT NULL,
    event_description TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id BIGINT,
    affected_resource VARCHAR(255),
    origin VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
