#!/usr/bin/env python3
"""
Script to update college account password to a known value
"""

import sqlite3
import os
from werkzeug.security import generate_password_hash

def update_college_password():
    """Update college account password to a known value"""
    try:
        # Database path
        db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'instance', 'credential_kavach.db')

        if not os.path.exists(db_path):
            print(f"❌ Database file not found: {db_path}")
            return False

        # Connect to database
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()

        print("=" * 60)
        print("🔑 UPDATING COLLEGE ACCOUNT PASSWORD")
        print("=" * 60)

        # Generate new password hash
        new_password = 'College@123'
        new_password_hash = generate_password_hash(new_password)

        # Update college account password
        cursor.execute("""
            UPDATE users
            SET password_hash = ?
            WHERE email = ?
        """, (new_password_hash, 'college@test.com'))

        # Check if update was successful
        if cursor.rowcount > 0:
            print("✅ College account password updated successfully")
            print(f"   Email: college@test.com")
            print(f"   New Password: {new_password}")
            conn.commit()
        else:
            print("❌ College account not found or password not updated")

        conn.close()
        return cursor.rowcount > 0

    except Exception as e:
        print(f"❌ Error updating college password: {e}")
        return False

if __name__ == '__main__':
    success = update_college_password()
    if success:
        print("\n✅ COLLEGE PASSWORD UPDATE SUCCESSFUL")
    else:
        print("\n❌ COLLEGE PASSWORD UPDATE FAILED")