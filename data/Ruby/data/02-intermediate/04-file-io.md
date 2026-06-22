## Lesson 4: File I/O

Interacting with the file system is a core requirement for backend applications, data processing scripts, and logging engines. Ruby provides the built-in `File` and `Dir` classes (built on top of the underlying `IO` stream class) to handle reading, writing, and directory manipulations smoothly.

---

## Reading Files Safely

Ruby offers both high-level methods to read an entire file into memory instantly and stream-based methods to process massive files line-by-line without exhausting memory.

### 1. Reading Everything into Memory

For small to medium configuration files or payloads, you can read the entire contents at once.

```ruby
# Read whole file as a single String
content = File.read("config.txt")

# Read whole file into an Array where each element is one line
lines = File.readlines("config.txt")

```

### 2. Stream-Based Reading (Line-by-Line)

When dealing with massive log files, loading the entire file into memory can crash your application. Using `File.foreach` streams the file content, keeping only a single line in memory at a time.

```ruby
# Production-safe pattern for processing large files
File.foreach("production.log") do |line|
  puts line if line.include?("ERROR")
end

```

---

## Writing and Appending Files

To write data, you open a file with a specific **access mode**. Ruby automatically creates the file if it does not already exist.

| Mode | Name | Behavior |
| --- | --- | --- |
| **`"w"`** | Write-Only | Truncates (wipes) the file to zero length or creates a new file for writing. |
| **`"a"`** | Append-Only | Starts writing at the end of the file. Preserves existing content. |
| **`"r"`** | Read-Only | Default mode. Opens the file for reading; raises an error if missing. |

```ruby
# 1. Quick block-based write (wipes previous content)
File.open("output.txt", "w") do |file|
  file.puts "Line 1: Overwriting file contents."
end

# 2. Appending data to an existing file
File.open("output.txt", "a") do |file|
  file.puts "Line 2: Appending a new log entry."
end

```

> **The Block Closure Rule:** Always use the block form (`File.open(...) do |file| ... end`) when manipulating files. When the block exits, Ruby automatically guarantees that the file descriptor is closed and flushed to disk, even if an exception occurs mid-stream. This prevents system memory leaks.

---

## File and Directory Queries

The `File` and `Dir` classes provide utility methods to inspect paths, verify permissions, and navigate directories.

```ruby
path = "data/users.json"

# File checks
puts File.exist?(path)    # Returns true if file or directory exists
puts File.file?(path)     # Returns true if it is an actual file, false if a directory
puts File.directory?("data") # Returns true if path is a directory

# Extracting path elements
puts File.basename(path)  # Output: "users.json"
puts File.extname(path)   # Output: ".json"
puts File.dirname(path)   # Output: "data"

```

### Directory Traversals

To view, search, or iterate through files within a specific folder, use `Dir`.

```ruby
# Get an array of all filenames matching a glob pattern
ruby_files = Dir.glob("src/**/*.rb")

# Iterate through files in the current directory
Dir.each_child(".") do |filename|
  puts "Found file: #{filename}"
end

```