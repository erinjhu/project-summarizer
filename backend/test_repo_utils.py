from repo_utils import clone_repo, read_project_files, cleanup_repo

if __name__ == "__main__":
    repo_url = "https://github.com/pallets/flask.git"  # Use any public repo
    repo_path = None
    try:
        repo_path = clone_repo(repo_url)
        print(f"Repo cloned to: {repo_path}")
        # Test reading project files
        content = read_project_files(repo_path)
        print("----- Project Content Preview -----")
        print(content[:1000])  # Print first 1000 chars for preview
    except Exception as e:
        print("Error:", e)
    finally:
        if repo_path:
            cleanup_repo(repo_path)
            print("Cleaned up.")