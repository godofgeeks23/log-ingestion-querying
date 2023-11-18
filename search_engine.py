import requests
import argparse

def search_elasticsearch(query, index, size=10, format="json"):
    endpoint = "http://localhost:9200/_sql"
    headers = {"Content-Type": "application/json"}
    
    payload = {
        "query": query,
        "fetch_size": size
    }

    params = {
        "format": format,
        "index": index
    }

    try:
        response = requests.post(endpoint, json=payload, headers=headers, params=params)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error executing query: {e}")
        return None

def main():
    parser = argparse.ArgumentParser(description="Elasticsearch CLI Search Tool")
    parser.add_argument("query", type=str, help="SQL-like query for Elasticsearch")
    parser.add_argument("--index", type=str, required=False, help="Elasticsearch index to search")
    parser.add_argument("--size", type=int, default=10, help="Number of results to fetch (default: 10)")
    parser.add_argument("--format", type=str, choices=["json", "txt"], default="json", help="Output format (json or txt, default: json)")

    args = parser.parse_args()

    result = search_elasticsearch(args.query, args.index, size=args.size, format=args.format)

    if result:
        if args.format == "json":
            print(result)
        elif args.format == "txt":
            for hit in result.get("rows", []):
                print(hit)
        else:
            print("Invalid format specified. Use 'json' or 'txt'.")

if __name__ == "__main__":
    main()
