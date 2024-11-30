import random
import re
import string
from typing import Any, Dict, List


def regex_get(dict: Dict, key: Any, default: Any = None, pattern: str = None) -> Any:
    """Get a value from a dictionary by a key and a regex pattern"""
    if key in dict:
        if pattern is None:
            return dict[key]
        else:
            result = re.search(pattern, dict[key])
            if result:
                return result.group(1)
            else:
                return default
    else:
        return default


def suggest_username(username: str, count: int = 3) -> List[str]:
    """Suggest username"""
    suggestions = []

    for _ in range(count):
        number = random.randint(1, 9999)
        suffix = "".join(random.choices(string.ascii_lowercase, k=2))
        suggestions.append(f"{username}_{suffix}")
        suggestions.append(f"{username}{number}")

    return list(set(suggestions))[:count]

if __name__ == "__main__":  # pragma: no cover
    print(suggest_username("pavel", 10))
