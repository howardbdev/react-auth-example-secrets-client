import React from 'react'

const Logout = ({ logout }) => {
  return (
    <div className="Logout">
      <form onSubmit={logout}>
        <input
          type="submit"
          value="Logout"
        />
      </form>
    </div>
  )
}

export default Logout
