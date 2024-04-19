import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { Button, Link, colors, styled } from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";
import { ChangeEvent } from "react";

//Type for user data
interface User {
  name: {
    first: string;
    last: string;
  };
  gender: string;
  email: string;
  location: {
    city: string;
    country: string;
  };
  dob: {
    date: string;
    age: number;
  };
  picture: {
    large: string;
    medium: string;
    thumbnail: string;
  };
  id: {
    value: number;
  };
}

//style
const StyleNa = styled("div")`
  display: flex;
  justifycontent: "flex-end";
`;

const StyleTo = styled("div")`
  display: flex;
  margin-top: 5%;
  @media only screen and (max-width: 768px) {
    display: block;
    margin-top: 0; /* Đặt margin-top về 0 khi màn hình nhỏ hơn hoặc bằng 768px */
  }
`;

const StyledDetail = styled("div")`
  padding-left: 10%;
`;

const StyledInfo = styled("div")`
  display: flex;
  border: white 1px;
  border-radius: 2%;
  width: 756px;
  margin-left: 10%;
  margin-top: 5%;
  background-color: white;
`;

const StyleImg = styled("div")`
  border-radious: 50%;
  padding-left: 15%;
  padding-top: 5%;
`;

const stylesBt = {
  backgroundColor: "transparent",
  width: "100%",
  colors: "white",
};

const StylePreNeBt = styled("div")`
  display: flex;
  justify-content: center;
  margin-top: 3%;
  @media only screen and (max-width: 768px) {
    margin-left: 100%;
  }
`;

const IconWrapper = styled("i")`
  display: none;

  @media only screen and (max-width: 768px) {
    display: inline-block;
    font-size: 64px;
  }
`;

const TextWrapper = styled("button")`
  @media only screen and (max-width: 768px) {
    display: none;
  }
`;
const AboutWrapper = styled("button")`
  @media only screen and (max-width: 768px) {
    display: none;
  }
`;

const InputWapper = styled("input")`
  top: 58px;
  position: relative;
  left: 486px;
  @media only screen and (max-width: 768px) {
    display: none;
  }
`;
const SearchWapper = styled("i")`
  display: none;
  @media only screen and (max-width: 768px) {
    display: inline-block;
    font-size: 30px;
  }
`;

//Component
const RandomUser: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilter, setShowFilter] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [input, setInput] = useState<boolean>(false);
  const [showIcon, setShowIcon] = useState(true); // Số lượng người dùng trên mỗi trang

  //fetch data

  useEffect(() => {
    const fetchRandomUsers = async () => {
      try {
        const response = await axios.get(
          "https://randomuser.me/api/?results=100"
        );
        const userData = response.data.results;
        setUsers(userData);
        setFilteredUsers(userData);
        setLoading(false);
      } catch (error: any) {
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError;
          setError(axiosError.message);
        } else {
          setError("Non-Axios error: " + error.message);
        }
        setLoading(false);
      }
    };

    fetchRandomUsers();
  }, []);

  useEffect(() => {
    setDisplayedUsers(users.slice(0, usersPerPage));
  }, [users, usersPerPage]);

  // Tính chỉ số của người dùng đầu tiên và cuối cùng trên mỗi trang
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const [displayedUsers, setDisplayedUsers] = useState<User[]>(currentUsers);

  // Tính số lượng trang
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(users.length / usersPerPage); i++) {
    pageNumbers.push(i);
  }

  //Onclick filter
  const handleFilterByAlphabetAz = () => {
    const filtered = [...currentUsers].sort((a, b) => {
      return a.name.last.localeCompare(b.name.last);
    });
    setFilteredUsers(filtered);
    setDisplayedUsers(filtered.slice(0, usersPerPage));
  };

  const handleFilterByAlphabetZa = () => {
    const filtered = [...currentUsers].sort((a, b) => {
      return b.name.last.localeCompare(a.name.last);
    });
    setFilteredUsers(filtered);
    setDisplayedUsers(filtered.slice(0, usersPerPage));
  };

  const handleFilterByAge = () => {
    const filtered = users.filter((user) => {
      const dob = new Date(user.dob.date);
      const age = new Date().getFullYear() - dob.getFullYear();
      return age < 19;
    });
    setFilteredUsers(filtered);
    setDisplayedUsers(filtered.slice(0, usersPerPage));
  };

  //name search
  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value;
    setSearchTerm(searchTerm);
    const filtered = users.filter((user) =>
      user.name.first.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
    setDisplayedUsers(filtered.slice(0, usersPerPage));
  };

  const goToPreviousPage = () => {
    const newPage = currentPage - 1;
    const newIndexOfLastUser = newPage * usersPerPage;
    const newIndexOfFirstUser = newIndexOfLastUser - usersPerPage;
    setCurrentPage(newPage);
    setDisplayedUsers(users.slice(newIndexOfFirstUser, newIndexOfLastUser));
  };

  const goToNextPage = () => {
    const newPage = currentPage + 1;
    const newIndexOfLastUser = newPage * usersPerPage;
    const newIndexOfFirstUser = newIndexOfLastUser - usersPerPage;
    setCurrentPage(newPage);
    setDisplayedUsers(users.slice(newIndexOfFirstUser, newIndexOfLastUser));
  };

  const paginate = (pageNumber: number) => {
    const newIndexOfLastUser = pageNumber * usersPerPage;
    const newIndexOfFirstUser = newIndexOfLastUser - usersPerPage;
    setCurrentPage(pageNumber);
    setDisplayedUsers(users.slice(newIndexOfFirstUser, newIndexOfLastUser));
  };

  const reloadPage = () => {
    window.location.reload(); // Load lại trang
  };

  const openInput = () => {
    setInput(true);
    setShowIcon(false);
  };
  return (
    <>
      <div>
        <div>
          <StyleNa>
            <div>
              <h1>User List</h1>
            </div>
            <div>
              <SearchWapper onClick={openInput}>
                {showIcon && (
                  <i
                    className="fa fa-search"
                    aria-hidden="true"
                    style={{ top: "58px", position: "relative", left: "486px" }}
                  ></i>
                )}
                {input && (
                  <input
                    placeholder="Search First Name ..."
                    value={searchTerm}
                    onChange={handleSearch}
                    type="text"
                    className="form-control"
                    aria-describedby="basic-addon1"
                    style={{
                      width: "100%",
                      marginTop: "54px",
                      position: "absolute",
                      left: "40%",
                    }}
                  />
                )}
              </SearchWapper>

              <InputWapper
                placeholder="Search First Name ..."
                value={searchTerm}
                onChange={handleSearch}
                type="text"
                className="form-control"
                aria-describedby="basic-addon1"
                style={{
                  width: "350%",
                  marginTop: "10px",

                  position: "relative",
                  left: "68%",
                }}
              />
            </div>
          </StyleNa>
        </div>
        <StyleTo>
          <IconWrapper
            onClick={() => setShowFilter(!showFilter)}
            className="fa fa-bars"
            aria-hidden="true"
          ></IconWrapper>
          <div style={{ backgroundColor: "#5651AB", marginTop: "3%" }}>
            <TextWrapper
              onClick={() => setShowFilter(!showFilter)}
              style={{
                backgroundColor: "transparent",
                width: "100%",
              }}
            >
              Filter
            </TextWrapper>
            {showFilter && (
              <div className="filter-popup">
                <button style={stylesBt} onClick={handleFilterByAlphabetAz}>
                  Filter A-Z
                </button>
                <button style={stylesBt} onClick={handleFilterByAlphabetZa}>
                  Filter Z-A
                </button>
                <button style={stylesBt} onClick={handleFilterByAge}>
                  Age under 19
                </button>
              </div>
            )}

            <AboutWrapper
              style={{
                backgroundColor: "transparent",
                width: "100%",
              }}
            >
              About Me
            </AboutWrapper>
          </div>
          <div>
            {error && <div>Error: {error}</div>}
            {displayedUsers.map((user, index) => (
              <StyledInfo key={index}>
                <div>
                  <img
                    src={user.picture.large}
                    alt="User Avatar"
                    style={{
                      borderRadius: "50%",
                      paddingTop: "5%",
                      paddingLeft: "15%",
                    }}
                  />
                </div>
                <StyledDetail>
                  <div>
                    <p>
                      <strong>Name:</strong> {user.name.first} {user.name.last}
                    </p>
                    <p>
                      <strong>Age:</strong> {user.dob.age}
                    </p>
                    <p>
                      <strong>Gender:</strong> {user.gender}
                    </p>
                    <p>
                      <strong>Email:</strong> {user.email}
                    </p>
                    <p>
                      <strong>Location:</strong> {user.location.city},{" "}
                      {user.location.country}
                    </p>
                    <p>
                      <strong>Date of Birth:</strong> {user.dob.date}
                    </p>
                  </div>
                </StyledDetail>
              </StyledInfo>
            ))}
          </div>
        </StyleTo>
      </div>
      <div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {/* Button to direction */}
            <StylePreNeBt>
              <ul className="pagination">
                <li className="page-item">
                  <a
                    className="page-link"
                    href="#"
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </a>
                </li>
                {pageNumbers.map((number) => (
                  <li key={number} className="page-item">
                    <a onClick={() => paginate(number)} className="page-link">
                      {number}
                    </a>
                  </li>
                ))}
                <li className="page-item">
                  <a
                    className="page-link"
                    href="#"
                    onClick={reloadPage}
                    disabled={indexOfLastUser >= users.length}
                  >
                    Next
                  </a>
                </li>
              </ul>
            </StylePreNeBt>
          </>
        )}
      </div>
    </>
  );
};

export default RandomUser;
