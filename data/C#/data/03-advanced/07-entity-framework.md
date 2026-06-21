# Lesson 7: Entity Framework Core Introduction

When building data-driven web applications or APIs, your code needs a way to store, update, and retrieve information from a database (like SQL Server, PostgreSQL, or SQLite). Writing raw SQL queries inside your C# strings can lead to messy, unmaintainable code and security risks like SQL injection.

**Entity Framework Core (EF Core)** is Microsoft's modern, open-source **Object-Relational Mapper (ORM)**. It bridges the gap between your object-oriented C# code and relational databases, allowing you to interact with database tables using strongly typed C# objects and LINQ expressions.

---

## 1. What is an Object-Relational Mapper (ORM)?

In a relational database, data is stored in rows and columns inside **Tables**. In C#, data is organized inside **Classes** and **Objects**. An ORM acts as an automatic translation layer between these two different paradigms.

```
┌─────────────────────────────┐              ┌─────────────────────────────┐
│       C# Application        │              │     Relational Database     │
│                             │              │                             │
│  [ Class: Product ]         │  ◄──EF Core──►  [ Table: Products ]        │
│    - Id (int)               │     (ORM)    │    - Id (INT, PK)           │
│    - Title (string)         │              │    - Title (VARCHAR)        │
│    - Cost (decimal)         │              │    - Cost (DECIMAL)         │
└─────────────────────────────┘              └─────────────────────────────┘

```

EF Core automatically translates your C# actions into highly optimized database SQL statements behind the scenes, ensuring you rarely have to write raw database queries manually.

---

## 2. Core Building Blocks: Model and DbContext

To use EF Core, you need two fundamental components: your data models (entities) and a database context coordinator class.

### 1. The Entity Model (The Class)

An entity is a standard C# class that maps directly to a specific table schema in your database. Each property on the class maps to a table column.

```csharp
public class Product
{
    // EF Core recognizes "Id" or "ProductId" automatically as the Primary Key
    public int Id { get; set; }
    public string Title { get; set; }
    public decimal Cost { get; set; }
}

```

### 2. The Database Context Class (`DbContext`)

The `DbContext` is the single most important class in an EF Core setup. It acts as the primary gateway, representing a dynamic connection session with the database. It exposes your entity collections via `DbSet<T>` properties.

```csharp
using Microsoft.EntityFrameworkCore;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    // This property maps directly to the physical 'Products' table in the database
    public DbSet<Product> Products { get; set; }
}

```

---

## 3. Querying and Modifying Data with EF Core

Once your context is configured and registered into your dependency injection framework, executing standard database CRUD (Create, Read, Update, Delete) tasks is streamlined using LINQ syntax:

```csharp
public class InventoryService
{
    private readonly AppDbContext _context;

    public InventoryService(AppDbContext context) => _context = context;

    public async Task ManageInventoryAsync()
    {
        // 1. CREATE: Instantiating and adding a new row
        Product newProduct = new Product { Title = "Wireless Mouse", Cost = 29.99M };
        _context.Products.Add(newProduct);
        
        // CRUCIAL: Changes are only cached locally until you call SaveChangesAsync
        await _context.SaveChangesAsync(); 

        // 2. READ: Fetching data from the database using LINQ
        Product mouse = await _context.Products.FirstOrDefaultAsync(p => p.Title == "Wireless Mouse");

        // 3. UPDATE: Modifying property data tracking
        if (mouse != null)
        {
            mouse.Cost = 24.99M; // Price drop
            await _context.SaveChangesAsync(); // Automatically generates an UPDATE SQL statement
        }

        // 4. DELETE: Removing a record
        _context.Products.Remove(mouse);
        await _context.SaveChangesAsync(); // Generates a DELETE SQL statement
    }
}

```

---

## 4. Database Migrations

When you build your application using the **Code-First** approach, you write your C# entities first. To translate those C# classes into physical tables, columns, and keys on an active database engine, you use EF Core **Migrations**.

A migration tracks changes you make to your models and generates a history log of C# instruction files to update your database schema in sync with your source code.

### Standard CLI Workflow:

1. **Modify Your Model:** You add a new property, like `public string Description { get; set; }` inside your `Product` class.
2. **Create a Migration:** Run the migration command in your terminal. This generates a structural snapshot file describing the change.
```bash
dotnet ef migrations add AddProductDescription

```


3. **Update the Database:** Apply the migration directly to your live database instance.
```bash
dotnet ef database update

```



---

## 5. Performance Essentials: Tracking vs. No-Tracking

By default, EF Core tracks changes to all entities retrieved from queries. If you modify properties on those entities, EF Core detects it automatically when you call `SaveChanges`. This tracking behavior requires an internal memory buffer footprint.

If you are executing a read-only query (such as fetching a massive list of products to display on a webpage without changing them), you can bypass the tracking memory overhead entirely using `.AsNoTracking()`. This drastically improves performance and reduces server resource usage.

```csharp
// High-performance read-only query
List<Product> catalog = await _context.Products
                                     .AsNoTracking()
                                     .Where(p => p.Cost > 50.00M)
                                     .ToListAsync();

```