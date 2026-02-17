ALTER TABLE tasks DROP CONSTRAINT tasks_assigned_to_fkey;
ALTER TABLE tasks ADD CONSTRAINT tasks_assigned_to_fkey 
    FOREIGN KEY (assigned_to) REFERENCES peoples(id) ON DELETE SET NULL;
