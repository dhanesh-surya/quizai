# Fix: UNIQUE Constraint Error on User Registration

## Problem
Users were unable to register on the production site (https://quizai-d4ta.onrender.com/register/) due to the following error:

```
UNIQUE constraint failed: quiz_userprofile.user_id
```

## Root Cause Analysis

The issue was caused by **duplicate UserProfile creation**. When a new user registered, the UserProfile was being created **multiple times**:

### 1. **Automatic Creation via Signal** (Correct)
In `backend/quiz/signals.py`:
```python
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.get_or_create(user=instance)
```
This signal automatically creates a UserProfile whenever a new User is created.

### 2. **Explicit Creation in View** (Duplicate - REMOVED)
In `backend/quiz/views.py` (register_view):
```python
user = User.objects.create_user(username=username, email=email, password=password)
UserProfile.objects.create(user=user)  # ❌ This was creating a duplicate!
```

### 3. **Explicit Creation in API Serializer** (Duplicate - FIXED)
In `backend/quiz/serializers.py` (RegisterSerializer):
```python
user = User.objects.create_user(**validated_data)
UserProfile.objects.create(user=user, is_admin=is_admin)  # ❌ Another duplicate!
```

## The Flow That Caused the Error

1. User submits registration form
2. `User.objects.create_user()` is called
3. **Signal fires** → Creates UserProfile #1 ✅
4. **View/Serializer** tries to create UserProfile #2 ❌
5. **Database rejects** due to UNIQUE constraint on `user_id` field

## Changes Made

### 1. Fixed `backend/quiz/views.py`
**Before:**
```python
user = User.objects.create_user(username=username, email=email, password=password)
UserProfile.objects.create(user=user)
auth_login(request, user)
```

**After:**
```python
user = User.objects.create_user(username=username, email=email, password=password)
# UserProfile is automatically created by the post_save signal
auth_login(request, user)
```

### 2. Fixed `backend/quiz/serializers.py`
**Before:**
```python
def create(self, validated_data):
    admin_code = validated_data.pop('admin_code', None)
    user = User.objects.create_user(**validated_data)
    
    # Create user profile
    is_admin = admin_code == 'admin123'
    UserProfile.objects.create(user=user, is_admin=is_admin)
    
    return user
```

**After:**
```python
def create(self, validated_data):
    admin_code = validated_data.pop('admin_code', None)
    user = User.objects.create_user(**validated_data)
    
    # UserProfile is automatically created by the post_save signal
    # Update the profile with admin status if needed
    is_admin = admin_code == 'admin123'
    if is_admin:
        profile = user.profile
        profile.is_admin = True
        profile.save()
    
    return user
```

## Why This Approach is Better

1. **Single Source of Truth**: UserProfile creation is handled in ONE place (the signal)
2. **DRY Principle**: Don't Repeat Yourself - no duplicate code
3. **Consistency**: All user registrations (web form, API, admin, social auth) automatically get a profile
4. **Maintainability**: Future changes to profile creation only need to be made in one place

## Signal Explanation

The `post_save` signal in Django fires automatically after a model instance is saved. Our signal:

```python
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:  # Only runs when a NEW user is created
        UserProfile.objects.get_or_create(user=instance)
```

- `created=True` means this is a new User (not an update)
- `get_or_create()` is safe - it won't create duplicates even if called multiple times

## Testing

### Local Testing
1. Try registering a new user via the web form
2. Try registering via the API endpoint
3. Both should work without errors

### Production Testing
Visit https://quizai-d4ta.onrender.com/register/ and create a new account.

## Related Files
- `backend/quiz/signals.py` - Contains the UserProfile creation signal
- `backend/quiz/views.py` - Web registration view
- `backend/quiz/serializers.py` - API registration serializer
- `backend/quiz/models.py` - UserProfile model definition

## Commit Information
- **Commit Message**: "Fix UNIQUE constraint error: Remove duplicate UserProfile creation"
- **Files Changed**: 
  - `backend/quiz/views.py`
  - `backend/quiz/serializers.py`
