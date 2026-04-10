import React, { useEffect } from 'react'
import '../AdminStyles/UsersList.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageTitle from '../components/PageTitle'
import { Link, useNavigate } from 'react-router-dom'
import { Delete, Edit } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { clearMessage, deleteUser, fetchUsers, removeErrors } from '../features/admin/adminSlice'
import { toast } from 'react-toastify'
import Loader from '../components/Loader'

function UsersList() {
    const {users,loading,error,message}=useSelector(state=>state.admin);
    const dispatch=useDispatch();
    const navigate=useNavigate();
    useEffect(()=>{
        dispatch(fetchUsers())
    },[dispatch])
      useEffect(()=>{
        if(error){
          toast.error(error.message,
          {position:'top-center',autoClose:3000});
          dispatch(removeErrors())
        }
      },[dispatch,error])

      const handleDelet=(userId)=>{
        const confirm=window.confirm('Are you Sure you want to delete this user?')
      if(confirm){
        dispatch(deleteUser(userId))
      }
    }
    useEffect(()=>{
        if(error){
          toast.error(error.message,
          {position:'top-center',autoClose:3000});
          dispatch(removeErrors())
        }
        if(message){
           toast.success(message,
          {position:'top-center',autoClose:3000});
          dispatch(clearMessage()) 
          navigate('/admin/dashboard')
        }
      },[dispatch,error,message])
  return (
    <>
   {loading?(<Loader/>):( <>
    <Navbar/>
        <PageTitle title="All Users"/>
        <div className="usersList-container">
            <h1 className="usersList-title">ALL Users</h1>
            <div className="usersList-table-container">
                <table className="usersList-table">
                    <thead>
                        <tr>
                            <th>SL No</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Create At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user,index)=>(
                            <tr key={user._id}>
                            <td>{index+1}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                            <td>
                                <Link className='action-icon edit-icon' to={`/admin/user/${user._id}`}><Edit/></Link>
                                <button className="action-icon delete-icon" onClick={()=>handleDelet(user._id)}><Delete/></button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    <Footer/>
    </>)}
    </>
  )
}

export default UsersList