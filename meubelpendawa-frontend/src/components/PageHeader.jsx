const PageHeader = ({
  title,
  subtitle,
  children,
}) => {
  return (
    <>
      <div className="md:-mt-7 mb-6">
        <h1 className="font-extrabold text-2xl md:text-3xl leading-tight">
          {title}
        </h1>

        <p className="text-xs md:text-base text-gray-500 mt-0">
          {subtitle}
        </p>
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-4">
        {children}
      </div>
    </>
  );
};

export default PageHeader;