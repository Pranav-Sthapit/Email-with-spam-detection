# Convert character to number (ASCII) and back
def char_to_number(char):
    return ord(char)

def number_to_char(num):
    return chr(num)

# Greatest common divisor
def gcd(a, b):
    while b != 0:
        a, b = b, a % b
    return a

# Trial-and-error modular inverse (works for small numbers)
def simple_mod_inverse(e, phi):
    for d in range(1, phi):
        if (e * d) % phi == 1:
            return d
    return -1

# Modular exponentiation
def mod_pow(base, exp, mod):
    result = 1
    base = base % mod
    while exp > 0:
        if exp % 2 == 1:
            result = (result * base) % mod
        base = (base * base) % mod
        exp //= 2
    return result

# Check prime
def is_prime(n):
    if n < 2:
        return False
    if n == 2:
        return True
    if n % 2 == 0:
        return False
    i = 3
    while i * i <= n:
        if n % i == 0:
            return False
        i += 2
    return True

# Next prime
def next_prime(n):
    if n % 2 == 0:
        n += 1
    while not is_prime(n):
        n += 2
    return n

# Generate prime from email (≥ lowerBound)
def random_prime(mail_address, lower_bound):
    num = 0
    for c in mail_address:
        num = num * 256 + ord(c)
    candidate = lower_bound + (num % 1000)
    if candidate < lower_bound:
        candidate = lower_bound
    while not is_prime(candidate):
        candidate += 1
    return candidate

# Generate RSA keys
def get_keys(mail_address):
    lower_bound = 256  # max char code
    P = next_prime(random_prime(mail_address, lower_bound))
    Q = next_prime(P + 1)  # ensure P != Q
    N = P * Q
    phi = (P - 1) * (Q - 1)

    # Choose public key e
    e = 3
    while gcd(e, phi) != 1:
        e += 2

    d = simple_mod_inverse(e, phi)
    return {'publicKey': e, 'privateKey': d, 'N': N}

# Encrypt message character by character
def encrypt_string(msg, public_key, N):
    return [mod_pow(char_to_number(c), public_key, N) for c in msg]

# Decrypt message character by character
def decrypt_string(encrypted_array, private_key, N):
    return ''.join(number_to_char(mod_pow(num, private_key, N)) for num in encrypted_array)

# --- Test ---
