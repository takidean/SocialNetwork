package com.bionic.socialNetwork.dao;

import com.bionic.socialNetwork.models.Password;

/**
 * @author Dmytro Troshchuk
 * @version 1.00  15.07.14.
 */
public interface PasswordDao {
    public String getPasswordById(long id) throws Exception;
    public void setPasswordById(long id, String pass) throws Exception;
}
