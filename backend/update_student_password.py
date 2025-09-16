#!/usr/bin/env python3
"""
Script to update student account password to a known value
"""

import sqlite3
import os
from werkzeug.security import generate_password_hash

def update_student_password():
    """Update student account password to a known value"""
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
        print("🔑 UPDATING STUDENT ACCOUNT PASSWORD")
        print("=" * 60)

        # Generate new password hash
        new_password = 'Student@123'
        new_password_hash = generate_password_hash(new_password)

        # Update student account password and ensure it's fully enabled
        cursor.execute("""
            UPDATE users
            SET password_hash = ?, is_verified = 1, is_approved = 1, is_active = 1
            WHERE email = ?
        """, (new_password_hash, 'student@test.com'))

        # Check if update was successful
        if cursor.rowcount > 0:
            print("✅ Student account updated successfully")
            print(f"   Email: student@test.com")
            print(f"   New Password: {new_password}")
            print("   Status: Verified, Approved, Active")
            conn.commit()
        else:
            print("❌ Student account not found or password not updated")

        conn.close()
        return cursor.rowcount > 0

    except Exception as e:
        print(f"❌ Error updating student password: {e}")
        return False

if __name__ == '__main__':
    success = update_student_password()
    if success:
        print("\n✅ STUDENT PASSWORD UPDATE SUCCESSFUL")
    else:
        print("\n❌ STUDENT PASSWORD UPDATE FAILED")