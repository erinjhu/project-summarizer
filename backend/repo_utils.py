import tempfile
import git
import os
import shutil
import stat

def clone_repo(repo_url: str) -> str:
    temp_dir = tempfile.mkdtemp()
    try:
        git.Repo.clone_from(repo_url, temp_dir)
        return temp_dir
    except Exception as e:
        shutil.rmtree(temp_dir)
        raise e
    
def read_project_files(repo_path: str, max_files=10, max_file_size=50_000) -> str:
    content = ""
    files_included = 0
    # Read README first
    for readme_name in ["README.md", "README.txt", "README"]:
        readme_path = os.path.join(repo_path, readme_name)
        if os.path.exists(readme_path):
            with open(readme_path, "r", encoding="utf-8", errors="ignore") as f:
                file_content = f.read(max_file_size)
                content += f"\n--- {readme_name} ---\n" + file_content
                files_included += 1
    # Read main source files
    for root, dirs, files in os.walk(repo_path):
        for file in files:
            if files_included >= max_files:
                break
            if file.endswith(('.py', '.js', '.ts', '.java')) and not file.startswith("test"):
                file_path = os.path.join(root, file)
                if os.path.getsize(file_path) > max_file_size:
                    continue
                with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                    file_content = f.read(max_file_size)
                    content += f"\n--- {file} ---\n" + file_content
                    files_included += 1
    return content

def handle_remove_readonly(func, path, exc):
    import errno
    import stat
    excvalue = exc[1]
    # Try to make the file writable and remove it again
    try:
        os.chmod(path, stat.S_IWRITE)
        func(path)
    except Exception:
        pass  # If it still fails, ignore or log

def cleanup_repo(repo_path: str):
    try:
        shutil.rmtree(repo_path, onerror=handle_remove_readonly)
    except Exception as e:
        print(f"Cleanup failed: {e}")