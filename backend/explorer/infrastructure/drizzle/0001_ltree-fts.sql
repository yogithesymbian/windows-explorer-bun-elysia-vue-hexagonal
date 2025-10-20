-- enable ltree
CREATE EXTENSION IF NOT EXISTS ltree;

-- add ltree column + index (GIST) untuk hierarki
ALTER TABLE folders ADD COLUMN path ltree NOT NULL DEFAULT 'root'::ltree;
CREATE INDEX idx_folders_path_gist ON folders USING GIST (path);

-- index tambahan
CREATE INDEX idx_folders_parent ON folders(parent_id);
CREATE INDEX idx_folders_name ON folders(name);

-- full-text search pada files
ALTER TABLE files ADD COLUMN search_vector tsvector;
CREATE INDEX idx_files_fts ON files USING GIN (search_vector);

-- trigger untuk isi search_vector
CREATE OR REPLACE FUNCTION files_search_trigger() RETURNS trigger AS $$
begin
  new.search_vector :=
    to_tsvector('english', coalesce(new.name,'') || ' ' || coalesce(new.ext,''));
  return new;
end
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_files_fts ON files;
CREATE TRIGGER trg_files_fts BEFORE INSERT OR UPDATE
ON files FOR EACH ROW EXECUTE PROCEDURE files_search_trigger();


/**
 * Kenapa GIST/GIN & FTS?
 * ltree menyediakan operator hierarki dan mendukung index GIST/GIN 
 * untuk mempercepat pencarian path bertingkat. [postgresql.org] 
 *
 * Untuk Full-Text Search, GIN adalah index yang direkomendasikan 
 * karena lookup lexeme sangat cepat pada kolom tsvector. [postgresql.org]
 * */