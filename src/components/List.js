import { AnimatePresence, motion } from "framer-motion";

const listV = {
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.3,
    },
  },
  hidden: {
    opacity: 0,
    transition: {
      when: "afterChildren",
      staggerChildren: 0.3,
    },
  },
};

const itemV = {
  visible: { opacity: 1, x: 0 },
  hidden: { opacity: 0, x: -100 },
};
const List = ({ list }) => {
  return (
    <div className="list">
      <AnimatePresence>
        <motion.ol variants={listV}>
          {list?.map(item => (
            <motion.li
              exit={{ opacity: 0, x: -100 }}
              variants={itemV}
              key={item}
            >
              {item}
            </motion.li>
          ))}
        </motion.ol>
      </AnimatePresence>
    </div>
  );
};

export default List;
