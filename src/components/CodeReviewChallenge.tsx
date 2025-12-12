import React, { useEffect, useState } from "react";
import styles from "./CodeReviewChallenge.module.css";

/**
 * ## 과제 5: 코드 리뷰
 *
 * 아래 `UserList`는 사용자 목록을 렌더링합니다. 정상 동작하지만 개선 여지가 있습니다.
 *
 * ### 요구사항:
 * 1. 코드(JSX 포함)를 읽고 잠재적인 문제점이나 개선점을 찾아보세요.
 * 2. 발견한 내용에 대해, 해당 코드 라인 근처에 주석을 사용하여 코드 리뷰를 작성해주세요.
 *    - 무엇이 문제인지, 왜 문제인지, 어떻게 개선할지 제시해주세요.
 * 3. 최소 3가지 이상의 유의미한 코드 리뷰를 작성해야 합니다.
 *
 * ### 선택사항:
 * - 코드 리뷰 작성을 넘어, 실제로 코드를 개선하여 리팩토링을 진행해보세요.
 * - (주의: 이 과제는 코드 리뷰 능력을 중점적으로 보기 때문에, 리뷰 작성 없이 리팩토링만 진행하면 안 됩니다.)
 */

type UserData = {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
};

// 가짜 API 호출 함수
const fetchUsers = (): Promise<UserData[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, name: "김철수", email: "chulsoo@example.com", isAdmin: false },
        { id: 2, name: "이영희", email: "younghee@example.com", isAdmin: true },
        { id: 3, name: "스티브", email: "steve@example.com", isAdmin: false },
        { id: 4, name: "관리자", email: "admin@example.com", isAdmin: true },
        { id: 5, name: "Steve Jobs", email: "sj@apple.com", isAdmin: false },
        { id: 6, name: "Apple Mint", email: "mint@gmail.com", isAdmin: false },
      ]);
    }, 500);
  });
};

const UserList = () => {
  // [리뷰1] - 타입안정성
  // any를 사용하면 typescript를 사용하는 장점이 없음
  // UserData를 사용해서 구체적인 타입을 지정해야함
  // 마찬가지로 string, boolean, boolean을 사용해 제네릭한 타입 지정

  // const [users, setUsers] = useState<any[]>([]); // state 1
  // const [filter, setFilter] = useState(''); // state 2
  // const [loading, setLoading] = useState(true); // state 3
  // const [showAdminsOnly, setShowAdminsOnly] = useState(false); // state 4

  const [users, setUsers] = useState<UserData[]>([]); // state 1
  const [filter, setFilter] = useState<string>(""); // state 2
  const [loading, setLoading] = useState<boolean>(true); // state 3
  const [showAdminsOnly, setShowAdminsOnly] = useState<boolean>(false); // state 4

  // 데이터 로딩
  // [리뷰2] 에러핸들링 없음 - api 호출에 실패했을때의 로직이 없음
  useEffect(() => {
    fetchUsers()
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("fetch 실패", error);
        setLoading(false);
      });
  }, []);

  // 필터링 로직
  // [리뷰3] 검색 로직의 대소문자 구분 / 성능 최적화 (디바운스 혹으 useMemo를 적용해 변화할때만 로직변경)
  // 'includes'는 대소문자를 구분함 -> toLowerCase() 처리 필요
  const filteredUsers = users.filter((user) => {
    const keyword = filter.toLocaleLowerCase();
    const nameMatches = user.name.toLocaleLowerCase().includes(keyword);
    const emailMatches = user.email.toLocaleLowerCase().includes(keyword);
    const adminMatches = !showAdminsOnly || user.isAdmin;
    return (nameMatches || emailMatches) && adminMatches;
  });

  return (
    <div className={styles.container}>
      <h2>과제 5: 코드 리뷰하기</h2>
      <p className={styles.description}>
        이 파일(`CodeReviewChallenge.tsx`)의 코드에 대한 리뷰를 주석으로
        작성해주세요.
      </p>

      <div className={styles.controls}>
        <input
          type="text"
          placeholder="이름으로 검색..."
          onChange={(e) => setFilter(e.target.value)}
          className={styles.input}
        />
        <label>
          <input
            type="checkbox"
            checked={showAdminsOnly}
            onChange={(e) => setShowAdminsOnly(e.target.checked)}
          />
          관리자만 보기
        </label>
      </div>

      {loading ? (
        <p>로딩 중...</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>이름</th>
              <th>이메일</th>
              <th>역할</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                {/* 역할(Role) 표시 */}
                <td style={{ color: u.isAdmin ? "blue" : "black" }}>
                  {u.isAdmin ? "Admin" : "User"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserList;
