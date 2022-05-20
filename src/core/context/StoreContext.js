import React, { createContext, useState } from 'react'

export const StoreContext = createContext();

const StoreProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(true)
    const [user, setUser] = useState({})

    return (
        <StoreContext.Provider value={{
            isLoggedIn, setIsLoggedIn,
            user, setUser,
        }}>
            {children}
        </StoreContext.Provider>
    )
}

export default StoreProvider