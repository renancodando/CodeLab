using Microsoft.Data.Sqlite;

namespace CodeLab;

public sealed record Account(string Id, string Name, string Email, string Hash, string Salt);
public sealed class Store
{
    private readonly string connection;
    public Store(IHostEnvironment environment)
    {
        var directory = Path.Combine(environment.ContentRootPath, "App_Data");
        Directory.CreateDirectory(directory);
        connection = new SqliteConnectionStringBuilder { DataSource = Path.Combine(directory, "codelab.db") }.ToString();
        using var db = Open();
        using var command = db.CreateCommand();
        command.CommandText = """
            PRAGMA journal_mode=WAL;
            CREATE TABLE IF NOT EXISTS accounts(id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE, hash TEXT NOT NULL, salt TEXT NOT NULL);
            CREATE TABLE IF NOT EXISTS progress(account_id TEXT PRIMARY KEY REFERENCES accounts(id), document TEXT NOT NULL, updated_at TEXT NOT NULL);
            """;
        command.ExecuteNonQuery();
    }
    private SqliteConnection Open() { var db = new SqliteConnection(connection); db.Open(); return db; }
    public Account? Find(string email)
    {
        using var db = Open(); using var command = db.CreateCommand();
        command.CommandText = "SELECT id, name, email, hash, salt FROM accounts WHERE email = $email";
        command.Parameters.AddWithValue("$email", email);
        using var reader = command.ExecuteReader();
        return reader.Read() ? new(reader.GetString(0), reader.GetString(1), reader.GetString(2), reader.GetString(3), reader.GetString(4)) : null;
    }
    public bool Create(Account account)
    {
        using var db = Open(); using var command = db.CreateCommand();
        command.CommandText = "INSERT INTO accounts(id,name,email,hash,salt) VALUES($id,$name,$email,$hash,$salt)";
        command.Parameters.AddWithValue("$id", account.Id); command.Parameters.AddWithValue("$name", account.Name); command.Parameters.AddWithValue("$email", account.Email); command.Parameters.AddWithValue("$hash", account.Hash); command.Parameters.AddWithValue("$salt", account.Salt);
        try { command.ExecuteNonQuery(); return true; } catch (SqliteException e) when (e.SqliteErrorCode == 19) { return false; }
    }
    public string? ReadProgress(string id)
    {
        using var db = Open(); using var command = db.CreateCommand();
        command.CommandText = "SELECT document FROM progress WHERE account_id=$id"; command.Parameters.AddWithValue("$id",id);
        return command.ExecuteScalar() as string;
    }
    public void SaveProgress(string id, string document)
    {
        using var db = Open(); using var command = db.CreateCommand();
        command.CommandText = "INSERT INTO progress(account_id,document,updated_at) VALUES($id,$document,$date) ON CONFLICT(account_id) DO UPDATE SET document=$document,updated_at=$date";
        command.Parameters.AddWithValue("$id",id); command.Parameters.AddWithValue("$document",document); command.Parameters.AddWithValue("$date",DateTimeOffset.UtcNow.ToString("O")); command.ExecuteNonQuery();
    }
}
